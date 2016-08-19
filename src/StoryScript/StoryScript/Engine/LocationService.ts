module StoryScript {
    export interface ILocationService {
        init(game: IGame): void;
        loadWorld(): ICollection<ICompiledLocation>;
        saveWorld(locations: ICollection<ICompiledLocation>): void;
        changeLocation(location: any, game: IGame): void;
    }
}

module StoryScript {
    export class LocationService implements ng.IServiceProvider, ILocationService {
        private $sce: ng.ISCEService;
        private dataService: IDataService;
        private ruleService: IRuleService;
        private game: IGame;
        private definitions: any;
        private pristineLocations: ICollection<ICompiledLocation>;
        private functionIdCounter: number = 0;
        private functionList: { [id: number]: Function };

        constructor($sce: ng.ISCEService, dataService: IDataService, ruleService: IRuleService, game: IGame, definitions: any) {
            var self = this;
            self.$sce = $sce;
            self.dataService = dataService;
            self.ruleService = ruleService;
            self.game = game;
            self.definitions = definitions;
        }

        public $get($sce: ng.ISCEService, dataService: IDataService, ruleService: IRuleService, game: IGame, definitions: any): ILocationService {
            var self = this;
            self.$sce = $sce;
            self.dataService = dataService;
            self.ruleService = ruleService;
            self.game = game;
            self.definitions = definitions;

            return {
                loadWorld: self.loadWorld,
                saveWorld: self.saveWorld,
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
            self.pristineLocations = self.buildWorld();
            var locations = <ICollection<ICompiledLocation>>self.dataService.load(DataKeys.WORLD);

            if (isEmpty(locations)) {
                self.dataService.save(DataKeys.WORLD, self.pristineLocations, self.pristineLocations);
                locations = <ICollection<ICompiledLocation>>self.dataService.load(DataKeys.WORLD);
            }

            // Add a proxy to the destination collection push function, to replace the target function pointer
            // with the target id when adding destinations and enemies at runtime.
            locations.forEach(function (location) {
                location.destinations = location.destinations || [];
                location.destinations.push = (<any>location.destinations.push).proxy(self.addDestination);
                location.enemies = location.enemies || [];
                location.enemies.push = (<any>location.enemies.push).proxy((function (): Function {
                    return function () {
                        var args = [].slice.apply(arguments);
                        args.splice(0, 0, this);
                        self.addEnemy(self, args);
                    }
                })());
                location.combatActions = location.combatActions || [];
            });

            return locations;
        }

        public saveWorld(locations: ICollection<ICompiledLocation>) {
            var self = this;
            self.dataService.save(DataKeys.WORLD, locations, self.pristineLocations);
        }

        public changeLocation(location: ILocation | ICompiledLocation, game: IGame) {
            var self = this;

            // If no location is specified, go to the previous location.
            if (!location) {
                var tempLocation = game.currentLocation;
                game.currentLocation = game.previousLocation;
                game.previousLocation = tempLocation;
                location = game.currentLocation;
            }
            // If currently at a location, make this the previous location.
            else if (game.currentLocation) {
                game.previousLocation = game.currentLocation;
            }

            // If there is no location, we are starting a new game. Quit for now.
            if (!location) {
                return;
            }

            var key = typeof location == 'function' ? location.name : location.id ? location.id : location;
            game.currentLocation = game.locations.get(key);

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
                        var barrierKey = <IKey>game.character.items.get(destination.barrier.key);

                        if (barrierKey) {

                            // Todo: improve using find on barrier actions.
                            var existing = null;
                            destination.barrier.actions.forEach(x => { if (x.text == barrierKey.open.text) { existing = x; }; });

                            if (existing) {
                                destination.barrier.actions.splice(destination.barrier.actions.indexOf(existing), 1);
                            }

                            destination.barrier.actions.push(barrierKey.open);
                        }
                    }
                });
            }

            // Save the previous and current location, then get the location text.
            self.dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);

            if (game.previousLocation) {
                self.dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
            }

            game.currentLocation.items = game.currentLocation.items || [];
            game.currentLocation.enemies = game.currentLocation.enemies || [];

            self.loadLocationDescriptions(game);

            if (self.ruleService.enterLocation) {
                self.ruleService.enterLocation(game.currentLocation);
            }

            self.initTrade(game);

            // If the player hasn't been here before, play the location events.
            if (!game.currentLocation.hasVisited) {
                game.currentLocation.hasVisited = true;
                self.playEvents(game);
            }

            self.loadConversations(game);
        }

        private initTrade(game: IGame) {
            // Todo: better way to get action. Use action function name from function list?
            if (game.currentLocation.trade && (!game.currentLocation.actions || !game.currentLocation.actions.some(a => a.type == ActionType.Trade))) {
                game.currentLocation.actions = game.currentLocation.actions || [];

                game.currentLocation.actions.push({
                    text: game.currentLocation.trade.title,
                    type: ActionType.Trade,
                    execute: 'trade',
                    arguments: [
                        game.currentLocation.trade
                    ]
                });
            }
        }

        private buildWorld(): ICompiledLocation[] {
            var self = this;
            self.functionIdCounter = 0;
            var locations = self.definitions.locations;
            var compiledLocations = [];
            self.functionList = {};

            for (var n in locations) {
                var definition = locations[n];
                var location = definitionToObject<ICompiledLocation>(definition);
                location.id = definition.name;

                if (!location.destinations) {
                    console.log('No destinations specified for location ' + location.id);
                }

                self.setDestinations(location);
                self.buildEnemies(location);
                self.buildPersons(location);
                self.buildItems(location);
                self.getFunctions(location);
                compiledLocations.push(location);
            }

            self.dataService.functionList = self.functionList;
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
            else {
                location.enemies = [];
            }
        }

        private buildPersons(location: ICompiledLocation) {
            var self = this;

            if (location.persons) {
                var persons: IPerson[] = [];

                location.persons.forEach((enDef) => {
                    var person = definitionToObject<IPerson>(<any>enDef);
                    self.buildItems(person);
                    persons.push(person);
                });

                (<any>location).persons = persons;
            }
            else {
                location.persons = [];
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
            else {
                entry.items = [];
            }
        }

        private getFunctions(location: any) {
            var self = this;

            for (var key in location) {
                if (!location.hasOwnProperty(key)) {
                    continue;
                }

                var value = location[key];

                if (value == undefined) {
                    return;
                }
                else if (typeof value === "object") {
                    self.getFunctions(location[key]);
                }
                else if (typeof value == 'function') {
                    self.functionList[self.functionIdCounter] = value;
                    value.functionId = self.functionIdCounter;
                    self.functionIdCounter++;
                }
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

        private addEnemy(scope: any, args: any) {
            var array = args[0];
            var originalFunction = args[1];
            var enemy = args[2];
            originalFunction.call(array, enemy);
            var ruleService = <IRuleService>scope.ruleService;

            if (ruleService.addEnemyToLocation) {
                ruleService.addEnemyToLocation((<IGame>scope.game).currentLocation, enemy);
            }
        }

        private playEvents(game: IGame) {
            var self = this;

            for (var n in game.currentLocation.events) {
                game.currentLocation.events[n](game);
            }
        }

        private loadConversations(game: IGame) {
            var self = this;

            if (!game.currentLocation.persons) {
                return;
            }

            game.currentLocation.persons.filter(p => !p.conversation).forEach((person) => {
                self.dataService.getDescription('persons', person.id).then(function (conversations) {
                    var parser = new DOMParser();

                    if (conversations.indexOf('<conversation>') == -1) {
                        conversations = '<conversation>' + conversations + '</conversation>';
                    }

                    var xmlDoc = parser.parseFromString(conversations, "text/xml");
                    var conversationNodes = xmlDoc.getElementsByTagName("node");

                    person.conversation = {
                        nodes: []
                    };

                    for (var i = 0; i < conversationNodes.length; i++) {
                        var node = conversationNodes[i];
                        var nameAttribute = node.attributes['name'];

                        if (!nameAttribute) {
                            throw new Error('Missing name attribute on node for conversation ' + person.id + '.');
                        }

                        if (person.conversation.nodes.some((node) => { return node.node == nameAttribute; })) {
                            throw new Error('Duplicate nodes with name ' + name + ' for conversation ' + person.id + '.');
                        }

                        var newNode = <IConversationNode>{
                            node: nameAttribute.value,
                            lines: '',
                            replies: []
                        };

                        for (var j = 0; j < node.childNodes.length; j++) {
                            var replies = node.childNodes[j];

                            if (replies.nodeName == 'replies') {
                                for (var k = 0; k < replies.childNodes.length; k++) {
                                    var replyNode = replies.childNodes[k];

                                    if (replyNode.nodeName == 'reply') {
                                        var reply = <IConversationReply>{
                                            requires: (replyNode.attributes['requires'] && replyNode.attributes['requires'].value) || null,
                                            lines: (<any>replyNode).innerHTML,
                                            linkToNode: (replyNode.attributes['node'] && replyNode.attributes['node'].value) || null
                                        }

                                        newNode.replies.push(reply);
                                    }
                                }

                                node.removeChild(replies);
                                newNode.lines = node.innerHTML;
                            }
                        }

                        person.conversation.nodes.push(newNode);
                    }
                });
            });
        }

        private loadLocationDescriptions(game: IGame) {
            var self = this;

            if (game.currentLocation.descriptions) {
                self.selectLocationDescription(game);
                return;
            }

            self.dataService.getDescription('locations', game.currentLocation.id).then(function (descriptions) {
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

                    game.currentLocation.descriptions[name] = self.$sce.trustAsHtml(node.innerHTML);
                }

                self.selectLocationDescription(game);
            });
        }

        private selectLocationDescription(game: IGame) {
            // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
            // use the default description selector function.
            if (game.currentLocation.descriptionSelector) {
                // Use this casting to allow the description selector to be a function or a string.
                var selector = typeof game.currentLocation.descriptionSelector == 'function' ? (<any>game.currentLocation.descriptionSelector)(game) : game.currentLocation.descriptionSelector;
                game.currentLocation.text = game.currentLocation.descriptions[selector];
            }
            else {
                game.currentLocation.text = game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[0];
            }
        }
    }

    LocationService.$inject = ['$sce', 'dataService', 'ruleService', 'game', 'definitions'];
}