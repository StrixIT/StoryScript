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

        init = (game: IGame, buildWorld?: boolean): void => {
            game.currentLocation = null;
            game.previousLocation = null;
            game.locations = this.loadWorld(buildWorld === undefined || buildWorld);
        }

        saveWorld = (locations: ICollection<ICompiledLocation>): void => this._dataService.save(DataKeys.WORLD, locations, this.pristineLocations);

        copyWorld = (): ICollection<ICompiledLocation> => this._dataService.copy(this._game.locations, this.pristineLocations);

        changeLocation = (location: string | (() => ILocation), travel: boolean, game: IGame): void => {
            // Clear the play state on travel.
            game.playState = null;

            if (game.currentLocation && game.currentLocation.leaveEvents) {
                this.playEvents(game, game.currentLocation.leaveEvents);
                game.currentLocation.leaveEvents.length = 0;
            }

            // If there is no location, we are starting a new game and we're done here.
            if (!this.switchLocation(game, location)) {
                return;
            }

            this.processDestinations(game);
            this.saveLocations(game);

            if (this._rules.exploration && this._rules.exploration.enterLocation) {
                this._rules.exploration.enterLocation(game, game.currentLocation, travel);
            }

            this.loadLocationDescriptions(game);
            this.initTrade(game);
            this.playEnterEvents(game);
            this._conversationService.loadConversations();

            // Add the 'back' button for testing
            if (this._rules.setup.autoBackButton && game.previousLocation && game.currentLocation.id != 'start') {
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

        private switchLocation = (game: IGame, location: string | (() => ILocation)): boolean => {
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

        private processDestinations = (game: IGame) => {
            if (game.currentLocation.destinations) {

                // remove the return message from the current location destinations.
                game.currentLocation.destinations.forEach(destination => {
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

        private saveLocations = (game: IGame): void => {
            // Save the previous and current location, then get the location text.
            this._dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);

            if (game.previousLocation) {
                this._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
            }
        }

        private playEnterEvents = (game: IGame): void => {
            // If the player hasn't been here before, play the location events. Also update
            // the visit statistics.
            if (!game.currentLocation.hasVisited) {
                if (game.currentLocation.enterEvents) {
                    this.playEvents(game, game.currentLocation.enterEvents);
                    game.currentLocation.enterEvents.length = 0;
                }

                game.currentLocation.hasVisited = true;
                game.statistics.LocationsVisited = game.statistics.LocationsVisited || 0;
                game.statistics.LocationsVisited += 1;
            }
        }

        private loadWorld = (buildWorld: boolean): ICollection<ICompiledLocation> => {
            const locations = this.getLocations(buildWorld);
            locations.forEach(l => this.initDestinations(l));
            return locations;
        }

        private getLocations = (buildWorld: boolean): ICollection<ICompiledLocation> => {
            var locations = <ICollection<ICompiledLocation>>null;

            if (buildWorld) {
                this.pristineLocations = this.buildWorld();
                locations = this._dataService.load(DataKeys.WORLD);

                if (isEmpty(locations)) {
                    this._dataService.save(DataKeys.WORLD, this.pristineLocations, this.pristineLocations);
                    locations = this._dataService.load(DataKeys.WORLD);
                }
            }
            else {
                locations = this._game.locations;
            }

            return locations;
        }

        private initDestinations = (location: ICompiledLocation): void => {
            // Add a proxy to the destination collection push function, to replace the target function pointer
            // with the target id when adding destinations and enemies at runtime.
            location.destinations.push = location.destinations.push.proxy(this.addDestination, this._game);

            // Set the selected action to an actual barrier action. This object reference is lost when serializing.
            if (location.destinations) {
                location.destinations.forEach(d => {
                    if (d.barrier && d.barrier.actions) {
                        d.barrier.actions.forEach(a => {
                            if (a.text === (d.barrier.selectedAction && d.barrier.selectedAction.text)) {
                                d.barrier.selectedAction = a;
                            }
                        })
                    }
                })
            }

            Object.defineProperty(location, 'activeDestinations', {
                get: function () {
                    return location.destinations.filter(e => { return !e.inactive; });
                }
            });
        }

        private initTrade = (game: IGame): void => {
            if (game.currentLocation.trade && (!game.currentLocation.actions || !game.currentLocation.actions.some(a => a.actionType == ActionType.Trade))) {

                game.currentLocation.actions.push({
                    text: game.currentLocation.trade.title,
                    actionType: ActionType.Trade,
                    execute: 'trade'
                });
            }
        }

        private buildWorld = (): ICollection<ICompiledLocation> => {
            var locations = this._definitions.locations;
            var compiledLocations = [];
            this.processLocations(locations, compiledLocations);
            return compiledLocations;
        }

        private processLocations = (locations: (() => ILocation)[], compiledLocations: ICollection<ICompiledLocation>): void => {
            for (var n in locations) {
                var definition = locations[n];
                var location = <ICompiledLocation>definition();
                this.setDestinations(location);
                compiledLocations.push(location);
            }
        }

        private setDestinations = (location: ICompiledLocation): void => {
            if (location.destinations) {
                location.destinations.forEach(destination => {
                    setDestination(destination);
                });
            }
        }

        private addDestination = (originalScope, originalFunction, destination, game): void => {
            setDestination(destination);
            addKeyAction(game, destination);
            originalFunction.call(originalScope, destination);
        }

        private playEvents = (game: IGame, events: ICollection<((game: IGame) => void)>): void => {
            for (var n in events) {
                events[n](game);
            }
        }

        private loadLocationDescriptions = (game: IGame): void => {
            if (!game.currentLocation.descriptions) {
                var descriptions = this._dataService.loadDescription('locations', game.currentLocation);

                if (descriptions) {
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(descriptions, 'text/html');

                    this.processVisualFeatures(htmlDoc, game);
                    this.processDescriptions(htmlDoc, game);
                }
            }

            this.selectLocationDescription(game);
            this.processTextFeatures(game);
        }

        private processDescriptions = (htmlDoc: Document, game: IGame): void => {
            var descriptionNodes = htmlDoc.getElementsByTagName('description');

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

        private processTextFeatures = (game: IGame): void => {
            if (!game.currentLocation.text) {
                return;
            }

            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(game.currentLocation.text, 'text/html');
            var featureNodes = <HTMLCollectionOf<HTMLElement>>htmlDoc.getElementsByTagName('feature');

            for (var i = 0; i < featureNodes.length; i++) {
                const node = featureNodes[i];
                const feature = this.getBasicFeatureData(game, node);

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

        private processVisualFeatures = (htmlDoc: Document, game: IGame): void => {
            var visualFeatureNode = htmlDoc.getElementsByTagName('visual-features')[0];

            if (visualFeatureNode) {
                game.currentLocation.features.collectionPicture = visualFeatureNode.attributes['img'] && visualFeatureNode.attributes['img'].nodeValue;

                if (game.currentLocation.features && game.currentLocation.features.length > 0 && visualFeatureNode) {
                    var areaNodes = <HTMLCollectionOf<HTMLAreaElement>>visualFeatureNode.getElementsByTagName('area');

                    for (var i = 0; i < areaNodes.length; i++) {
                        const node = areaNodes[i];
                        const feature = this.getBasicFeatureData(game, node);

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

        private getBasicFeatureData = (game: IGame, node: HTMLElement): IFeature => {
            var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;

            if (!nameAttribute) {
                throw new Error('There is no name attribute for a feature node for location ' + game.currentLocation.id + '.');
            }

            return game.currentLocation.features.filter(f => compareString(f.id, nameAttribute))[0];
        }

        private selectLocationDescription = (game: IGame): void => {
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
            else if (this._rules.exploration && this._rules.exploration.descriptionSelector && (selector = this._rules.exploration.descriptionSelector(game))) {
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