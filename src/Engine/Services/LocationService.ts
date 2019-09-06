namespace StoryScript {
    export interface ILocationService {
        init(game: IGame, buildWorld?: boolean): void;
        saveWorld(locations: ICollection<ICompiledLocation>): void;
        copyWorld(): ICollection<ICompiledLocation>;
        changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
    }
}

namespace StoryScript {
    export class LocationService implements ILocationService {
        private pristineLocations: ICollection<ICompiledLocation>;

        constructor(private _dataService: IDataService, private _conversationService: IConversationService, private _rules: IRules, private _game: IGame, private _definitions: IDefinitions) {
        }

        init = (game: IGame, buildWorld?: boolean) => {
            var self = this;
            game.changeLocation = (location, travel) => { self.changeLocation.call(self, location, travel, game); };
            game.currentLocation = null;
            game.previousLocation = null;
            game.locations = self.loadWorld(buildWorld === undefined || buildWorld);
        }

        saveWorld = (locations: ICollection<ICompiledLocation>) => {
            var self = this;
            self._dataService.save(DataKeys.WORLD, locations, self.pristineLocations);
        }

        copyWorld = (): ICollection<ICompiledLocation> => {
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

            if (self._rules.exploration && self._rules.exploration.enterLocation) {
                self._rules.exploration.enterLocation(game, game.currentLocation, travel);
            }

            self.loadLocationDescriptions(game);
            self.initTrade(game);
            self.playEnterEvents(game);
            self._conversationService.loadConversations();

            // Add the 'back' button for testing
            if (self._rules.setup.autoBackButton && game.previousLocation && game.currentLocation.id != 'start') {
                var backTestDestinationName = 'testbackdestination';
                var backDestination = game.currentLocation.destinations.get(game.previousLocation.id) 
                                        || game.currentLocation.destinations.get(backTestDestinationName);

                if (!backDestination) {         
                    var backLocation = {
                        id: backTestDestinationName,
                        target: game.previousLocation.id,
                        name: `Back to ${game.previousLocation.name}`,
                        style: 'auto-back-button'
                    };

                    game.currentLocation.destinations.push(backLocation);
                }
            }
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

            var key = typeof location == 'function' ? location.name || location.originalFunctionName : location ? location : presentLocation.id;
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

            // If the player hasn't been here before, play the location events. Also update
            // the visit statistics.
            if (!game.currentLocation.hasVisited) {
                if (game.currentLocation.enterEvents) {
                    self.playEvents(game, game.currentLocation.enterEvents);
                }

                game.currentLocation.hasVisited = true;
                game.statistics.LocationsVisited = game.statistics.LocationsVisited || 0;
                game.statistics.LocationsVisited += 1;
            }
        }

        private loadWorld(buildWorld: boolean): ICollection<ICompiledLocation> {
            var self = this;

            const locations = self.getLocations(buildWorld);

            locations.forEach(function (location) {
                self.initDestinations(location);
            });

            return locations;
        }

        private getLocations(buildWorld: boolean): ICollection<ICompiledLocation> {
            var self = this;
            var locations = <ICollection<ICompiledLocation>>null;

            if (buildWorld) {
                self.pristineLocations = self.buildWorld();
                locations = self._dataService.load(DataKeys.WORLD);

                if (isEmpty(locations)) {
                    self._dataService.save(DataKeys.WORLD, self.pristineLocations, self.pristineLocations);
                    locations = self._dataService.load(DataKeys.WORLD);
                }
            }
            else {
                locations = self._game.locations;
            }

            return locations;
        }

        private initDestinations(location: ICompiledLocation) {
            var self = this;

            // Add a proxy to the destination collection push function, to replace the target function pointer
            // with the target id when adding destinations and enemies at runtime.
            location.destinations.push = location.destinations.push.proxy(location.destinations.push, self.addDestination, self._game);

            Object.defineProperty(location, 'activeDestinations', {
                get: function () {
                    return location.destinations.filter(e => { return !e.inactive; });
                }
            });
        }

        private initTrade(game: IGame) {
            // Todo: better way to get action. Use action function name from function list?
            if (game.currentLocation.trade && (!game.currentLocation.actions || !game.currentLocation.actions.some(a => a.actionType == ActionType.Trade))) {

                game.currentLocation.actions.push({
                    text: game.currentLocation.trade.title,
                    actionType: ActionType.Trade,
                    execute: 'trade'
                    // Arguments are ignored here. These are dealt with in the trade function on the main controller.
                });
            }
        }

        private buildWorld(): ICollection<ICompiledLocation> {
            var self = this;
            var locations = self._definitions.locations;
            var compiledLocations = [];
            self.processLocations(locations, compiledLocations);
            return compiledLocations;
        }

        private processLocations(locations: (() => ILocation)[], compiledLocations: ICollection<ICompiledLocation>) {
            var self = this;

            for (var n in locations) {
                var definition = locations[n];
                var location = <ICompiledLocation>definition();
                self.setDestinations(location);
                compiledLocations.push(location);
            }
        }

        private setDestinations(location: ICompiledLocation) {
            if (location.destinations) {
                location.destinations.forEach(destination => {
                    setDestination(destination);
                });
            }
        }

        private addDestination() {
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();
            var destination = <IDestination>args[0];
            var game = <IGame>args[1];
            args.splice(1, 1);

            setDestination(destination);
            addKeyAction(game, destination);
            originalFunction.apply(this, args);
        }

        private playEvents(game: IGame, events: ICollection<((game: IGame) => void)>) {
            for (var n in events) {
                events[n](game);
            }
        }

        private loadLocationDescriptions(game: IGame) {
            var self = this;

            if (!game.currentLocation.descriptions) {
                var descriptions = self._dataService.loadDescription('locations', game.currentLocation);

                if (descriptions) {
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(descriptions, "text/html");

                    self.processVisualFeatures(htmlDoc, game);
                    self.processDescriptions(htmlDoc, game);
                }
            }

            self.selectLocationDescription(game);
            self.processTextFeatures(game);
        }

        private processDescriptions(htmlDoc: Document, game: IGame) {
            var descriptionNodes = htmlDoc.getElementsByTagName("description");

            if (!descriptionNodes || !descriptionNodes.length) {
                return;
            }

            game.currentLocation.descriptions = {};

            for (var i = 0; i < descriptionNodes.length; i++) {
                var node = descriptionNodes[i];
                var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;
                var name = nameAttribute ? nameAttribute : 'default';

                if (game.currentLocation.descriptions[name]) {
                    throw new Error('There is already a description with name ' + name + ' for location ' + game.currentLocation.id + '.');
                }

                game.currentLocation.descriptions[name] = node.innerHTML;
            }      
        }

        private processTextFeatures(game: IGame) {
            var self = this;

            if (!game.currentLocation.text) {
                return;
            }

            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(game.currentLocation.text, "text/html");
            var featureNodes = <HTMLCollectionOf<HTMLElement>>htmlDoc.getElementsByTagName('feature');

            for (var i = 0; i < featureNodes.length; i++) {
                const node = featureNodes[i];
                const feature = self.getBasicFeatureData(game, node);

                // If the feature is not present in code, clean the node html as the feature is either
                // not yet added (the feature tag is a placeholder for a feature added at runtime) or it
                // was deleted. Clean the node html to not show the feature text in case it was deleted.
                if (!feature) {
                    node.innerHTML = '';
                }
                else {
                    feature.description = node.innerHTML || feature.description;
                    node.innerHTML = addHtmlSpaces(feature.description);
                }
            }
         
            game.currentLocation.text = htmlDoc.body.innerHTML;
        }

        private processVisualFeatures(htmlDoc: Document, game: IGame) {
            var self = this;
            var visualFeatureNode = htmlDoc.getElementsByTagName('visual-features')[0];

            if (visualFeatureNode) {
                game.currentLocation.features.collectionPicture = visualFeatureNode.attributes['img'] && visualFeatureNode.attributes['img'].nodeValue;

                if (game.currentLocation.features && game.currentLocation.features.length > 0 && visualFeatureNode) {
                    var areaNodes = <HTMLCollectionOf<HTMLAreaElement>>visualFeatureNode.getElementsByTagName('area');

                    for (var i = 0; i < areaNodes.length; i++) {
                        const node = areaNodes[i];
                        const feature = self.getBasicFeatureData(game, node);

                        if (feature) {
                            feature.coords = feature.coords || node.attributes['coords'] && node.attributes['coords'].nodeValue;
                            feature.shape = feature.shape || node.attributes['shape'] && node.attributes['shape'].nodeValue;
                            feature.picture = feature.picture || node.attributes['img'] && node.attributes['img'].nodeValue;
                        }
                    }
                }

                visualFeatureNode.parentNode.removeChild(visualFeatureNode);
            }
        }

        private getBasicFeatureData(game: IGame, node: HTMLElement): IFeature {
            var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;

            if (!nameAttribute) {
                throw new Error('There is no name attribute for a feature node for location ' + game.currentLocation.id + '.');
            }

            nameAttribute = nameAttribute.toLowerCase();
            return game.currentLocation.features.filter(f => f.id.toLowerCase() === nameAttribute)[0];
        }

        private selectLocationDescription(game: IGame) {
            var self = this;
            var selector = null;

            if (!game.currentLocation.descriptions) {
                return;
            }

            // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
            // use the default description selector function.
            if (game.currentLocation.descriptionSelector) {
                // Use this casting to allow the description selector to be a function or a string.
                selector = typeof game.currentLocation.descriptionSelector == 'function' ? (<any>game.currentLocation.descriptionSelector)(game) : game.currentLocation.descriptionSelector;
                game.currentLocation.text = game.currentLocation.descriptions[selector];
            }
            else if (self._rules.exploration && self._rules.exploration.descriptionSelector && (selector = self._rules.exploration.descriptionSelector(game))) {
                game.currentLocation.text = game.currentLocation.descriptions[selector] || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[0];
            }
            else {
                game.currentLocation.text = game.currentLocation.text || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[Object.keys(game.currentLocation.descriptions)[0]];
            }
        }
    }

    function addKeyAction(game: IGame, destination: IDestination) {
        if (destination.barrier && destination.barrier.key) {
            var key = typeof destination.barrier.key === 'function' ? destination.barrier.key() : <IKey>game.helpers.getItem( destination.barrier.key);
            var existingAction = null;
            var keyActionHash = createFunctionHash(key.open.execute);

            if (destination.barrier.actions) {
                destination.barrier.actions.forEach(x => {
                    if (createFunctionHash(x.execute) === keyActionHash) {
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

            var keyId = key.id;
            var barrierKey = <IKey>(game.character.items.get(keyId) || game.currentLocation.items.get(keyId));

            if (barrierKey) {
                destination.barrier.actions.push(barrierKey.open);
            }
        }
    }

    function setDestination(destination: IDestination) {
        // Replace the function pointers for the destination targets with the function keys.
        // That's all that is needed to navigate, and makes it easy to save these targets.
        // Note that dynamically added destinations already have a string as target so use that one.
        // Also set the barrier selected actions to the first one available for each barrier.
        // Further, replace combine functions with their target ids.
        var target = destination.target;
        target = typeof target === 'function' ? target.name || target.originalFunctionName : target;
        destination.target = target && target.toLowerCase();

        if (destination.barrier) {
            if (destination.barrier.key) {
                var key = destination.barrier.key;
                destination.barrier.key = typeof key === 'function' ? key.name || key.originalFunctionName : key;
            }

            if (destination.barrier.actions && destination.barrier.actions.length > 0) {
                destination.barrier.selectedAction = destination.barrier.actions[0];
            }

            if (destination.barrier.combinations && destination.barrier.combinations.combine) {
                for (var n in destination.barrier.combinations.combine) {
                    var combination = destination.barrier.combinations.combine[n];
                    var tool = <any>combination.tool;
                    combination.tool = tool && (tool.name || tool.originalFunctionName).toLowerCase();
                }
            }
        }
    }
}