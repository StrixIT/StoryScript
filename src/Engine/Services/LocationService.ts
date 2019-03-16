namespace StoryScript {
    export interface ILocationService {
        init(game: IGame, buildWorld?: boolean): void;
        saveWorld(locations: ICompiledCollection<ILocation, ICompiledLocation>): void;
        copyWorld(): ICompiledCollection<ILocation, ICompiledLocation>;
        changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
    }
}

namespace StoryScript {
    export class LocationService implements ILocationService {
        private pristineLocations: ICompiledCollection<ILocation, ICompiledLocation>;
        private dynamicLocations: boolean = false;

        constructor(private _dataService: IDataService, private _conversationService: IConversationService, private _rules: IRules, private _game: IGame, private _definitions: IDefinitions) {
        }

        init = (game: IGame, buildWorld?: boolean) => {
            var self = this;
            game.changeLocation = (location, travel) => { self.changeLocation.call(self, location, travel, game); };
            game.currentLocation = null;
            game.previousLocation = null;
            game.locations = self.loadWorld(buildWorld === undefined || buildWorld);
            game.definitions.dynamicLocations = self.dynamicLocations;
        }

        saveWorld = (locations: ICompiledCollection<ILocation, ICompiledLocation>) => {
            var self = this;
            self._dataService.save(DataKeys.WORLD, locations, self.pristineLocations);
        }

        copyWorld = (): ICompiledCollection<ILocation, ICompiledLocation> => {
            var self = this;
            return self._dataService.copy(self._game.locations, self.pristineLocations);
        }

        changeLocation = (location: string | (() => ILocation), travel: boolean, game: IGame) => {
            var self = this;

            // TODO: shouldn't these events be played only once?
            if (game.previousLocation && game.previousLocation.leaveEvents) {
                self.playEvents(game, game.previousLocation.leaveEvents);
            }

            // If there is no location, we are starting a new game and we're done here.
            if (!self.switchLocation(game, location)) {
                return;
            }

            self.processDestinations(game);
            self.saveLocations(game);

            if (self._rules.enterLocation) {
                self._rules.enterLocation(game, game.currentLocation, travel);
            }

            // In dynamic mode, refresh the location on every browser reload.
            // Todo: should descriptions be refreshed this way for default mode as well?
            if (!travel && game.definitions.dynamicLocations) {
                game.currentLocation.descriptions = null;
                game.currentLocation.text = null;
            }

            self.loadLocationDescriptions(game);
            self.initTrade(game);
            self.playEnterEvents(game);
            self._conversationService.loadConversations(game);
        }

        private switchLocation(game: IGame, location: string | (() => ILocation)): boolean {
            var presentLocation: ICompiledLocation;

            // If no location is specified, go to the previous location.
            if (!location) {
                var tempLocation = game.currentLocation;
                game.currentLocation = game.previousLocation;
                game.previousLocation = tempLocation;
                presentLocation = game.currentLocation;
            }
            // If currently at a location, make this the previous location.
            else if (game.currentLocation) {
                game.previousLocation = game.currentLocation;
            }

            if (!location && !presentLocation) {
                return false;
            }

            var key = typeof location == 'function' ? <string>(<any>location).name : location ? location : presentLocation.id;
            game.currentLocation = game.locations.get(key);
            return true;
        }

        private processDestinations(game: IGame) {
            if (game.currentLocation.destinations) {

                // remove the return message from the current location destinations.
                game.currentLocation.destinations.forEach(function (destination) {
                    if ((<any>destination).isPreviousLocation) {
                        (<any>destination).isPreviousLocation = false;
                    }
                });

                // Mark the previous location in the current location's destinations to allow
                // the player to more easily backtrack his last step. Also, check if the user
                // has the key for one or more barriers at this location, and add the key actions
                // if that is the case.
                game.currentLocation.destinations.forEach(destination => {
                    if (game.previousLocation && destination.target && (<any>destination.target) == game.previousLocation.id) {
                        (<any>destination).isPreviousLocation = true;
                    }

                    addKeyAction(game, destination);
                });

                game.currentLocation.destinations.forEach(destination => {
                    if (destination.barrier && destination.barrier.actions) {
                        destination.barrier.selectedAction = destination.barrier.actions[0];
                    }
                });
            }
        }

        private saveLocations(game: IGame) {
            var self = this;

            // Save the previous and current location, then get the location text.
            self._dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);

            if (game.previousLocation) {
                if (game.previousLocation.complete) {
                    game.previousLocation.complete(game, game.previousLocation);
                }

                self._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
            }
        }

        private playEnterEvents(game: IGame) {
            var self = this;

            // If the player hasn't been here before, play the location events.
            if (!game.currentLocation.hasVisited && game.currentLocation.enterEvents) {
                self.playEvents(game, game.currentLocation.enterEvents);
                game.currentLocation.hasVisited = true;
                game.statistics.LocationsVisited = game.statistics.LocationsVisited || 0;
                game.statistics.LocationsVisited += 1;
            }
        }

        private loadWorld(buildWorld: boolean): ICompiledCollection<ILocation, ICompiledLocation> {
            var self = this;

            const locations = self.getLocations(buildWorld);

            locations.forEach(function (location) {
                self.initDestinations(location);

                createReadOnlyCollection(location, 'features', location.features || <any>[]);
                location.features.push = location.features.push.proxy(self.addFeature, self._game);
                location.features.remove = location.features.remove.proxy(self.removeFeature, self._game);

                createReadOnlyCollection(location, 'actions', <any>location.actions || []);
                location.actions.push = location.actions.push.proxy(self.addAction, self._game);

                createReadOnlyCollection(location, 'combatActions', <any>location.combatActions || []);
                location.combatActions.push = location.combatActions.push.proxy(self.addAction, self._game);

                createReadOnlyCollection(location, 'persons', location.persons || <any>[]);
                createReadOnlyCollection(location, 'enemies', location.enemies || <any>[]);
                createReadOnlyCollection(location, 'items', location.items || <any>[]);

                self.createActiveCollections(location);

                addProxy(location, 'enemy', self._game, self._rules);
            });

            return locations;
        }

        private getLocations(buildWorld: boolean): ICompiledCollection<ILocation, ICompiledLocation> {
            var self = this;
            var locations: ICompiledCollection<ILocation, ICompiledLocation> = null;

            if (buildWorld) {
                self.pristineLocations = self.buildWorld();
                locations = <ICompiledCollection<ILocation, ICompiledLocation>>self._dataService.load(DataKeys.WORLD);

                if (isEmpty(locations)) {
                    self._dataService.save(DataKeys.WORLD, self.pristineLocations, self.pristineLocations);
                    locations = <ICompiledCollection<ILocation, ICompiledLocation>>self._dataService.load(DataKeys.WORLD);
                }
            }
            else {
                locations = self._game.locations;
            }

            return locations;
        }

        private createActiveCollections(location: ICompiledLocation) {
            Object.defineProperty(location, 'activePersons', {
                get: function () {
                    return location.persons.filter(e => { return !e.inactive; });
                }
            });

            Object.defineProperty(location, 'activeEnemies', {
                get: function () {
                    return location.enemies.filter(e => { return !e.inactive; });
                }
            });

            Object.defineProperty(location, 'activeItems', {
                get: function () {
                    return location.items.filter(e => { return !e.inactive; });
                }
            });
        }

        private initDestinations(location: ICompiledLocation) {
            var self = this;
            createReadOnlyCollection(location, 'destinations', location.destinations || <any>[]);

            // Add a proxy to the destination collection push function, to replace the target function pointer
            // with the target id when adding destinations and enemies at runtime.
            location.destinations.push = (<any>location.destinations.push).proxy(self.addDestination, self._game);

            Object.defineProperty(location, 'activeDestinations', {
                get: function () {
                    return location.destinations.filter(e => { return !e.inactive; });
                }
            });
        }

        private initTrade(game: IGame) {
            // Todo: better way to get action. Use action function name from function list?
            if (game.currentLocation.trade && (!game.currentLocation.actions || !game.currentLocation.actions.some(a => a.type == ActionType.Trade))) {

                game.currentLocation.actions.push({
                    text: game.currentLocation.trade.title,
                    type: ActionType.Trade,
                    execute: 'trade'
                    // Arguments are ignored here. These are dealt with in the trade function on the main controller.
                });
            }
        }

        private buildWorld(): ICompiledLocation[] {
            var self = this;
            var locations = self._definitions.locations;
            var compiledLocations = [];

            if (locations.length < 1)
            {
                self.dynamicLocations = true;
                var dynamicStartLocation = function Start () { return { name: 'Start' } };

                locations = [
                    dynamicStartLocation
                ];
            }

            self.processLocations(locations, compiledLocations);

            return compiledLocations;
        }

        private processLocations(locations: [() => ILocation], compiledLocations: ICompiledLocation[]) {
            var self = this;

            for (var n in locations) {
                var definition = locations[n];
                var location = <ICompiledLocation><any>definitionToObject(definition, 'locations', self._definitions);

                if (!self.dynamicLocations && !location.destinations) {
                    console.log('No destinations specified for location ' + location.id);
                }

                self.setDestinations(location);
                self.compileFeatures(location);
                self.buildEntries(location, 'enemies', self._game.helpers.getEnemy);
                self.buildEntries(location, 'persons', self._game.helpers.getPerson);
                self.buildEntries(location, 'items', self._game.helpers.getItem);
                compiledLocations.push(location);
            }
        }

        private buildEntries(location: ICompiledLocation, collectionName: string, instantiateFunction: Function) {
            var self = this;
            var collection = [];

            for (var n in location[collectionName]) {
                var name = location[collectionName][n].name;
                var entry = name ? instantiateFunction(location[collectionName][n]) : location[collectionName][n]();
                collection.push(entry);
            }

            location[collectionName] = collection;
        }

        private setDestinations(location: ICompiledLocation) {
            var self = this;

            if (location.destinations) {
                location.destinations.forEach(destination => {
                    setDestination(destination);
                });
            }
        }

        private compileFeatures(location: ICompiledLocation) {
            var self = this;

            if (!isEmpty(location.features)) {

                for (var i in location.features) {
                    var feature = location.features[i];

                    // Compile stand-alone features that are still functions.
                    if (typeof feature === 'function') {
                        location.features[i] = (<() => IFeature>feature)();
                        feature = location.features[i];
                    }

                    feature.id = feature.name;

                    if (feature.combinations && feature.combinations.combine) {
                        for (var j in feature.combinations.combine) {
                            var combination = feature.combinations.combine[j];
                            setTool(combination);
                        }
                    }
                }
            }
        }

        private addDestination() {
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();

            var destination = <IDestination>args[0];
            setDestination(destination);
            addKeyAction(args[1], destination);
            args.splice(1, 1);
            originalFunction.apply(this, args);
        }

        private addFeature() {
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();

            // Compile a feature passed as a function first.
            if (typeof args[0] === 'function') {
                args[0] = args[0]();
            }

            var feature = <IFeature>args[0];

            if (feature.combinations && feature.combinations.combine) {
                feature.combinations.combine.forEach(c => setTool(c));
            }

            var map = findImageMap(feature);

            if (map) {     
                var area = document.createElement('area');
                area.setAttribute('coords', feature.coords);
                area.setAttribute('shape', feature.shape);
                map.appendChild(area);
                area.setAttribute('name', feature.name);
                addFeaturePicture(feature, area.attributes['coords'].nodeValue, area);
            }

            args.splice(1, 1);
            originalFunction.apply(this, args);
        }

        private removeFeature() {
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();
            var featureId = typeof args[0] === 'function' ? args[0].name : typeof args[0] === 'object' ? args[0].id : args[0];
            var game = <IGame>args[1];
            var feature = game.currentLocation.features.get(featureId);

            if (feature) {
                var area = findImageMapArea(feature);

                if (area) {
                    area.parentNode.removeChild(area);
                }
            }

            args.splice(1, 1);
            originalFunction.apply(this, args);
        }

        private addAction() {
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();

            // Add the action function ids.
            addFunctionIds(args[0], 'actions', getDefinitionKeys(self._definitions));
            args.splice(1, 1);
            originalFunction.apply(this, args);
        }

        private playEvents(game: IGame, events: [(game: IGame) => void]) {
            var self = this;

            for (var n in events) {
                events[n](game);
            }
        }

        private loadLocationDescriptions(game: IGame) {
            var self = this;

            if (game.currentLocation.descriptions) {
                self.selectLocationDescription(game);
                return;
            }

            var descriptions = self._dataService.loadDescription('locations', game.currentLocation);
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(descriptions, "text/html");

            self.processDescriptions(htmlDoc, game);
            self.processDynamicLocations(htmlDoc, game);
            self.processFeatures(htmlDoc, game);
            self.selectLocationDescription(game);
        }

        private processDescriptions(htmlDoc: Document, game: IGame) {
            var descriptionNodes = htmlDoc.getElementsByTagName("description");
            game.currentLocation.descriptions = {};

            for (var i = 0; i < descriptionNodes.length; i++) {
                var node = descriptionNodes[i];
                var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;
                var displayNameAttribute = node.attributes['displayname'] && node.attributes['displayname'].nodeValue;
                var name = nameAttribute ? nameAttribute : 'default';

                if (game.currentLocation.descriptions[name]) {
                    throw new Error('There is already a description with name ' + name + ' for location ' + game.currentLocation.id + '.');
                }

                game.currentLocation.descriptions[name] = node.innerHTML;
                game.currentLocation.name = displayNameAttribute || game.currentLocation.name;
            }
        }

        private processDynamicLocations(htmlDoc: Document, game: IGame) {
            var self = this;

            if (!game.definitions.dynamicLocations) {
                return;
            }

            game.currentLocation.destinations.length = 0;

            // Add a 'back' destination for easy testing
            if (game.previousLocation && game.previousLocation) {
                var backLocation = {
                    id: game.previousLocation.id,
                    target: <any>game.previousLocation.id,
                    name: 'back',
                    style: 'dynamic-back-button'
                };

                game.currentLocation.destinations.push(backLocation);
            }

            self.processDynamicDestinations(htmlDoc, game);
        }

        private processDynamicDestinations(htmlDoc: Document, game: IGame) {
            var self = this;

            var destinationsNodes = htmlDoc.getElementsByTagName("destination");

            for (var i = 0; i < destinationsNodes.length; i++) {
                var node = destinationsNodes[i];
                var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;

                if (!nameAttribute)
                {
                    console.log('There is a destination without a name for location ' + game.currentLocation.id + '.');
                    continue;
                }

                var targetExists = self._dataService.loadDescription('locations', { id: nameAttribute }) != null;

                var locationToAdd = { id: nameAttribute, target: targetExists ? nameAttribute : null, name: node.innerHTML, destinations: [] };
                self.initDestinations(locationToAdd);

                game.locations.push(locationToAdd);
                game.currentLocation.destinations.push(locationToAdd);
            }
        }

        private processFeatures(htmlDoc: Document, game: IGame) {
            var self = this;
            self.processTextFeatures(game, htmlDoc);
            self.processVisualFeatures(game);
        }

        private processTextFeatures(game: IGame, htmlDoc: Document) {
            var featureNodes = htmlDoc.getElementsByTagName("feature");

            if (game.currentLocation.features && game.currentLocation.features.length > 0) {
                for (var i = 0; i < featureNodes.length; i++) {
                    const node = featureNodes[i];
                    var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;
                    var displayNameAttribute = node.attributes['displayname'] && node.attributes['displayname'].nodeValue;

                    if (!nameAttribute) {
                        throw new Error('There is no name attribute for a feature node for location ' + game.currentLocation.id + '.');
                    }

                    nameAttribute = nameAttribute.toLowerCase();

                    if (!game.currentLocation.features.some(f => f.name.toLowerCase() === nameAttribute)) {
                        console.log('There is no feature with name ' + nameAttribute + ' for location ' + game.currentLocation.id + '.');
                    }

                    var feature = game.currentLocation.features.filter(f => f.id.toLowerCase() === nameAttribute)[0];
                    feature.name = displayNameAttribute || feature.name;
                    feature.description = node.innerHTML;
                }
            }
        }

        private processVisualFeatures(game: IGame) {
            var self = this;

            // Get map, shape and coordinates information for image map features and add pictures for them.
            // For this to work, the description needs to be updated in the browser, hence the timeout.
            setTimeout(() => {
                var map = document.getElementsByTagName("map")[0];

                if (map) {
                    var mapName = map.attributes['name'] && map.attributes['name'].nodeValue;
                    var areaNodes = map.childNodes;

                    for (var f = 0; f < areaNodes.length; f++) {
                        const node = <HTMLAreaElement>areaNodes[f];
                        var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;

                        if (nameAttribute) {
                            var feature = game.currentLocation.features.get(nameAttribute);

                            if (feature) {
                                var shapeAttribute = node.attributes['shape'] && node.attributes['shape'].nodeValue;
                                var coordsAttribute = node.attributes['coords'] && node.attributes['coords'].nodeValue;
                                var shapeAttribute = node.attributes['shape'] && node.attributes['shape'].nodeValue;
                                feature.map = mapName;
                                feature.coords = coordsAttribute;
                                feature.shape = shapeAttribute;

                                if (feature.picture) {
                                    addFeaturePicture(feature, coordsAttribute, node);
                                }
                            }
                        }
                    }
                }
            }, 0);
        }

        private selectLocationDescription(game: IGame) {
            var self = this;
            var selector = null;

            // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
            // use the default description selector function.
            if (game.currentLocation.descriptionSelector) {
                // Use this casting to allow the description selector to be a function or a string.
                selector = typeof game.currentLocation.descriptionSelector == 'function' ? (<any>game.currentLocation.descriptionSelector)(game) : game.currentLocation.descriptionSelector;
                game.currentLocation.text = game.currentLocation.descriptions[selector];
            }
            else if (self._rules.descriptionSelector && (selector = self._rules.descriptionSelector(game))) {
                game.currentLocation.text = game.currentLocation.descriptions[selector] || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[0];
            }
            else {
                game.currentLocation.text = game.currentLocation.text || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[0];
            }
        }
    }

    function addKeyAction(game: IGame, destination: IDestination) {
        if (destination.barrier && destination.barrier.key) {
            var existingAction = null;
            var keyActionHash = createFunctionHash((<any>destination.barrier.key).open.action);

            if (destination.barrier.actions) {
                destination.barrier.actions.forEach(x => {
                    if (createFunctionHash(x.action) === keyActionHash) {
                        existingAction = x;
                    };
                });
            }
            else {
                destination.barrier.actions = [];
            }

            if (existingAction) {
                destination.barrier.actions.splice(destination.barrier.actions.indexOf(existingAction), 1);
            }

            var barrierKey = <IKey>(game.character.items.get(destination.barrier.key) || game.currentLocation.items.get(destination.barrier.key));

            if (barrierKey) {
                destination.barrier.actions.push(barrierKey.open);
            }
        }
    }

    function setDestination(destination: IDestination) {
        var self = this;

        // Replace the function pointers for the destination targets with the function keys.
        // That's all that is needed to navigate, and makes it easy to save these targets.
        // Note that dynamically added destinations already have a string as target so use that one.
        // Also set the barrier selected actions to the first one available for each barrier.
        // Further, instantiate any keys present and replace combine functions with their target ids.
        destination.target = (destination.target && (<any>destination.target).name) || destination.target;

        if (destination.barrier) {
            if (destination.barrier.actions && destination.barrier.actions.length > 0) {
                destination.barrier.selectedAction = destination.barrier.actions[0];
            }

            if (destination.barrier.key) {
                (<any>destination.barrier).key = definitionToObject(destination.barrier.key, 'items', self.definitions);
            }

            if (destination.barrier.combinations && destination.barrier.combinations.combine) {
                for (var n in destination.barrier.combinations.combine) {
                    var combination = destination.barrier.combinations.combine[n];
                    setTool(combination);
                }
            }
        }
    }

    function setTool(combination: ICombine<() => ICombinable>) {
        combination.tool = combination.tool && (<any>combination.tool).name;
    }

    function findImageMap(feature: IFeature) {
        var mapElement = <HTMLMapElement>null;

        if (feature && feature.map) {
            var imageMaps = document.getElementsByTagName("map");

            for (var i = 0; i < imageMaps.length; i++) {
                var map = <HTMLMapElement>imageMaps[i];
                
                if (map.name && map.name.toLowerCase() === feature.map.toLowerCase()) {
                    mapElement = map;
                }
            }
        }

        return mapElement;
    }

    function findImageMapArea(feature: IFeature) {
        var area = <HTMLAreaElement>null;
        var map = findImageMap(feature);

        if (map) {
            map.childNodes.forEach(n => {
                var attributes = (<any>n).attributes;
                var areaName = attributes['name'] && attributes['name'].nodeValue;
                
                if (areaName.toLowerCase() === feature.id.toLowerCase()) {
                    area = <HTMLAreaElement>n;
                }
            });
        }

        return area;
    }

    function addFeaturePicture(feature: IFeature, coordsAttribute: any, node: HTMLAreaElement) {
        var image = document.createElement('img');
        var coords = coordsAttribute.split(",");
        var top = null, left = null;

        if (feature.shape.toLowerCase() === 'poly') {
            var x = [], y = [];

            for (var i = 0; i < coords.length; i++) {
                var value = coords[i];
                if (i % 2 === 0) {
                    x.push(value);
                }
                else {
                    y.push(value);
                }
            }

            left = x.reduce(function (p, v) {
                return (p < v ? p : v);
            });
            
            top = y.reduce(function (p, v) {
                return (p < v ? p : v);
            });
        }
        else {
            left = coords[0];
            top = coords[1];
        }

        image.src = 'resources/' + feature.picture;
        image.style.position = 'absolute';
        image.style.top = top + 'px';
        image.style.left = left + 'px';
        node.appendChild(image);
    }
}