module StoryScript {
    export interface ILocationService {
        init(game: IGame): void;
        loadWorld(): ICollection<ICompiledLocation>;
        changeLocation(location: any, game: IGame): void;
    }
}

module StoryScript {
    export class LocationService implements ng.IServiceProvider, ILocationService {
        private dataService: IDataService;
        private ruleService: IRuleService;

        constructor(dataService: IDataService, ruleService: IRuleService) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
        }

        public $get(dataService: IDataService, ruleService: IRuleService): ILocationService {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;

            return {
                loadWorld: self.loadWorld,
                changeLocation: self.changeLocation,
                init: self.init
            };
        }

        init = (game: IGame) => {
            var self = this;
            game.changeLocation = (location) => { self.changeLocation.call(self, location, game); };
            game.currentLocation = null;
            game.previousLocation = null;
            game.locations = self.loadWorld();
        }

        public loadWorld(): ICollection<ICompiledLocation> {
            var self = this;
            var locations = null;

            //self.locations = <ICollection<ICompiledLocation>>self.dataService.load<any>(DataKeys.WORLD).Locations;

            if (isEmpty(locations)) {
                locations = self.buildWorld();
                //self.dataService.save(DataKeys.WORLD, { Locations: self.locations });
                //self.locations = <ICollection<ICompiledLocation>>self.dataService.load<any>(DataKeys.WORLD).Locations;
            }

            // Add a proxy to the destination collection push function, to replace the target function pointer
            // with the target id when adding destinations and enemies at runtime.
            locations.forEach(function (location) {
                location.destinations = location.destinations || [];
                location.destinations.push = (<any>location.destinations.push).proxy(self.addDestination);
                location.enemies = location.enemies || [];
                location.enemies.push = (<any>location.enemies.push).proxy(self.addEnemy);
                location.combatActions = location.combatActions || [];
            });

            return locations;
        }

        public changeLocation(location: ILocation, game: IGame) {
            var self = this;

            // If no location is specified, go to the previous location.
            if (!location) {
                var tempLocation = game.currentLocation;
                game.currentLocation = game.previousLocation;
                game.previousLocation = tempLocation;
                // Todo: can this be typed somehow?
                location = <any>game.currentLocation;
            }
            // If currently at a location, make this the previous location.
            else if (game.currentLocation) {
                game.previousLocation = game.currentLocation;
            }

            var key = typeof location == 'function' ? location.name : location.id ? location.id : location;
            game.currentLocation = game.locations.first(key);

            // remove the return message from the current location destinations.
            if (game.currentLocation.destinations) {
                game.currentLocation.destinations.forEach(function (destination) {
                    if ((<any>destination).isPreviousLocation) {
                        (<any>destination).isPreviousLocation = false;
                    }
                });
            }

            // Mark the previous location in the current location's destinations to allow
            // the player to more easily backtrack his last step. Also, check if the user
            // has the key for one or more barriers at this location, and add the key actions
            // if that is the case.
            if (game.currentLocation.destinations) {
                game.currentLocation.destinations.forEach(destination => {
                    if (game.previousLocation && destination.target && (<any>destination.target) == game.previousLocation.id) {
                        (<any>destination).isPreviousLocation = true;
                    }

                    if (destination.barrier && destination.barrier.key) {
                        key = <IKey>game.character.items.first(destination.barrier.key);

                        if (key) {
                            // Todo: can this be typed somehow?
                            (<any>destination.barrier.actions).openWithKey = (<any>key).open();
                        }
                    }
                });
            }

            // Save the previous and current location, then get the location text.
            self.dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);

            if (game.previousLocation) {
                self.dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
            }

            self.loadLocationDescriptions(game);

            self.ruleService.initCombat(game.currentLocation);
            self.ruleService.enterLocation(game.currentLocation);

            // If the player hasn't been here before, play the location events.
            if (!game.currentLocation.hasVisited) {
                game.currentLocation.hasVisited = true;
                self.playEvents(game);
            }
        }

        private buildWorld(): ICompiledLocation[] {
            var self = this;
            var locations = window['StoryScript']['Locations'];
            var compiledLocations = [];

            for (var n in locations) {
                var definition = locations[n];
                var location = definitionToObject<ICompiledLocation>(definition);
                location.id = definition.name;

                if (!location.destinations) {
                    console.log('No destinations specified for location ' + location.id);
                }

                self.setDestinations(location);
                self.buildEnemies(location);
                self.buildItems(location);
                compiledLocations.push(location);
            }

            return compiledLocations;
        }

        private setDestinations(location: ICompiledLocation) {
            var self = this;

            // Replace the function pointers for the destination targets with the function keys.
            // That's all that is needed to navigate, and makes it easy to save these targets.
            // Also set the barrier selected actions to the first one available for each barrier.
            if (location.destinations) {
                location.destinations.forEach(destination => {
                    //if (typeof destination.target == 'function') {
                    destination.target = (<any>destination.target).name;
                    //}

                    if (destination.barrier) {
                        if (destination.barrier.actions && destination.barrier.actions.length > 0) {
                            destination.barrier.selectedAction = destination.barrier.actions[0];
                        }
                    }
                });
            }
        }

        private buildEnemies(location: ICompiledLocation) {
            var self = this;

            if (location.enemies) {
                var enemies: IEnemy[] = [];

                location.enemies.forEach((enDef) => {
                    var enemy = definitionToObject<IEnemy>(<any>enDef);
                    self.buildItems(enemy);
                    enemies.push(enemy);
                });

                (<any>location).enemies = enemies;
            }
        }

        private buildItems(entry: any) {
            var self = this;

            if (entry.items) {
                var items: IItem[] = [];

                entry.items.forEach((itemDef) => {
                    var item = definitionToObject<IItem>(itemDef);
                    items.push(item);
                });

                (<any>entry).items = items;
            }
        }

        private addDestination() {
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();

            // Replace the target function pointer with the target id.
            for (var n in args) {
                var param = args[n];
                param.target = param.target.name;
            }

            originalFunction.apply(this, args);
        }

        private addEnemy(game: IGame) {
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();
            var enemy = originalFunction.apply(this, args);
            self.ruleService.addEnemyToLocation(game.currentLocation, enemy);
        }

        private playEvents(game: IGame) {
            var self = this;

            for (var n in game.currentLocation.events) {
                game.currentLocation.events[n](game);
            }
        }

        private loadLocationDescriptions(game: IGame) {
            var self = this;

            if (game.currentLocation.descriptions) {
                return;
            }

            self.dataService.getDescription(game.currentLocation.id).then(function (descriptions) {
                var parser = new DOMParser();

                if (descriptions.indexOf('<descriptions>') == -1) {
                    descriptions = '<descriptions>' + descriptions + '</descriptions>';
                }

                var xmlDoc = parser.parseFromString(descriptions, "text/xml");
                var descriptionNodes = xmlDoc.getElementsByTagName("description");
                game.currentLocation.descriptions = {};

                for (var i = 0; i < descriptionNodes.length; i++) {
                    var node = descriptionNodes[i];
                    var nameAttribute = node.attributes['name'];
                    var name = nameAttribute ? nameAttribute.value : 'default';

                    if (game.currentLocation.descriptions[name]) {
                        throw new Error('There is already a description with name ' + name + ' for location ' + game.currentLocation.id + '.');
                    }

                    game.currentLocation.descriptions[name] = node.innerHTML;
                }

                // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
                // use the default description selector function.
                if (game.currentLocation.descriptionSelector) {
                    game.currentLocation.text = game.currentLocation.descriptionSelector();
                }
                else {
                    var descriptionSelector = (<any>game.currentLocation).defaultDescriptionSelector;
                    game.currentLocation.text = descriptionSelector ? descriptionSelector() : game.currentLocation.descriptions['default'];
                }

                // If the description selector did not return a text, use the default description.
                if (!game.currentLocation.text) {
                    game.currentLocation.text = game.currentLocation.descriptions['default'];
                }
            });
        }
    }

    LocationService.$inject = ['dataService', 'ruleService'];
}