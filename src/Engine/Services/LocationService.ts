namespace StoryScript {
    export interface ILocationService {
        init(game: IGame, buildWorld?: boolean): void;
        saveWorld(locations: ICompiledCollection<ILocation, ICompiledLocation>): void;
        changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame): void;
        copyWorld(): ICompiledCollection<ILocation, ICompiledLocation>;
    }
}

namespace StoryScript {
    export class LocationService implements ILocationService {
        private pristineLocations: ICompiledCollection<ILocation, ICompiledLocation>;

        constructor(private _dataService: IDataService, private _rules: IRules, private _game: IGame, private _definitions: IDefinitions) {
        }

        init = (game: IGame, buildWorld?: boolean) => {
            var self = this;
            game.changeLocation = (location, travel) => { self.changeLocation.call(self, location, travel, game); };
            game.currentLocation = null;
            game.previousLocation = null;
            game.locations = self.loadWorld(buildWorld === undefined || buildWorld);
        }

        private loadWorld(buildWorld: boolean): ICompiledCollection<ILocation, ICompiledLocation> {
            var self = this;

            if (buildWorld) {
                self.pristineLocations = self.buildWorld();
                var locations = <ICompiledCollection<ILocation, ICompiledLocation>>self._dataService.load(DataKeys.WORLD);

                if (isEmpty(locations)) {
                    self._dataService.save(DataKeys.WORLD, self.pristineLocations, self.pristineLocations);
                    locations = <ICompiledCollection<ILocation, ICompiledLocation>>self._dataService.load(DataKeys.WORLD);
                }
            }
            else {
                locations = self._game.locations;
            }

            locations.forEach(function (location) {
                createReadOnlyCollection(location, 'destinations', location.destinations || <any>[]);

                // Add a proxy to the destination collection push function, to replace the target function pointer
                // with the target id when adding destinations and enemies at runtime.
                location.destinations.push = (<any>location.destinations.push).proxy(self.addDestination, self._game);

                createReadOnlyCollection(location, 'features', location.features || <any>[]);
                location.features.push = (<any>location.features.push).proxy(self.addFeature, self._game);

                createReadOnlyCollection(location, 'actions', <any>location.actions || []);
                location.actions.push = (<any>location.actions.push).proxy(self.addAction, self._game);

                createReadOnlyCollection(location, 'combatActions', <any>location.combatActions || []);
                location.combatActions.push = (<any>location.combatActions.push).proxy(self.addAction, self._game);

                createReadOnlyCollection(location, 'persons', location.persons || <any>[]);
                createReadOnlyCollection(location, 'enemies', location.enemies || <any>[]);
                createReadOnlyCollection(location, 'items', location.items || <any>[]);

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

                Object.defineProperty(location, 'activeDestinations', {
                    get: function () {
                        return location.destinations.filter(e => { return !e.inactive; });
                    }
                });

                addProxy(location, 'enemy', self._game, self._rules);
            });

            return locations;
        }

        public saveWorld(locations: ICompiledCollection<ILocation, ICompiledLocation>) {
            var self = this;
            self._dataService.save(DataKeys.WORLD, locations, self.pristineLocations);
        }

        public changeLocation(location: string | (() => ILocation), travel: boolean, game: IGame) {
            var self = this;
            var presentLocation: ICompiledLocation;

            // TODO: shouldn't these events be played only once?
            if (game.previousLocation && game.previousLocation.leaveEvents) {
                self.playEvents(game, game.previousLocation.leaveEvents);
            }

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

            // If there is no location, we are starting a new game. Quit for now.
            if (!location && !presentLocation) {
                return;
            }

            var key = typeof location == 'function' ? <string>(<any>location).name : location ? location : presentLocation.id;
            game.currentLocation = game.locations.get(key);

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

                    addKeyAction(self._game, destination);
                });

                game.currentLocation.destinations.forEach(destination => {
                    if (destination.barrier && destination.barrier.actions) {
                        destination.barrier.selectedAction = destination.barrier.actions[0];
                    }
                });
            }

            // Save the previous and current location, then get the location text.
            self._dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);

            if (game.previousLocation) {
                if (!game.previousLocation.hasVisited) {
                    game.previousLocation.hasVisited = true;
                    self._game.statistics.LocationsVisited = self._game.statistics.LocationsVisited || 0;
                    self._game.statistics.LocationsVisited += 1;
                }

                if (game.previousLocation.complete) {
                    game.previousLocation.complete(game, game.previousLocation);
                }

                self._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
            }

            if (self._rules.enterLocation) {
                self._rules.enterLocation(game, game.currentLocation, travel);
            }

            self.loadLocationDescriptions(game);

            self.initTrade(game);

            // If the player hasn't been here before, play the location events.
            if (!game.currentLocation.hasVisited && game.currentLocation.enterEvents) {
                self.playEvents(game, game.currentLocation.enterEvents);
            }

            self.loadConversations(game);
        }

        copyWorld = (): ICompiledCollection<ILocation, ICompiledLocation> => {
            var self = this;
            return self._dataService.copy(self._game.locations, self.pristineLocations);
        }

        private initTrade(game: IGame) {
            // Todo: better way to get action. Use action function name from function list?
            if (game.currentLocation.trade && (!game.currentLocation.actions || !game.currentLocation.actions.some(a => a.type == ActionType.Trade))) {

                game.currentLocation.actions.push({
                    text: game.currentLocation.trade.title,
                    type: ActionType.Trade,
                    execute: 'trade'
                    // Arguments are ignored for now, are dealt with in the trade function on the main controller.
                });
            }
        }

        private buildWorld(): ICompiledLocation[] {
            var self = this;
            var locations = self._definitions.locations;
            var compiledLocations = [];

            for (var n in locations) {
                var definition = locations[n];
                var location = <ICompiledLocation><any>definitionToObject(definition, 'locations', self._definitions);

                if (!location.destinations) {
                    console.log('No destinations specified for location ' + location.id);
                }

                self.setDestinations(location);
                self.compileFeatures(location);
                self.buildEntries(location, 'enemies', self._game.helpers.getEnemy);
                self.buildEntries(location, 'persons', self._game.helpers.getPerson);
                self.buildEntries(location, 'items', self._game.helpers.getItem);
                compiledLocations.push(location);
            }

            return compiledLocations;
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
                    feature.id = feature.name;

                    if (feature.combinations && feature.combinations.combine) {
                        for (var j in feature.combinations.combine) {
                            var combination = feature.combinations.combine[j];
                            combination.target = (<any>combination.target).name;
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
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();

            // Replace the target function pointer with the target id.
            var feature = <IFeature>args[0];
            feature.combinations.combine.forEach(c => c.target = (<any>c.target).name);

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

        private loadConversations(game: IGame) {
            var self = this;

            if (!game.currentLocation.persons) {
                return;
            }

            game.currentLocation.persons.filter(p => p.conversation && !p.conversation.nodes).forEach((person) => {
                var conversations = self._dataService.loadDescription('persons', person);
                var parser = new DOMParser();

                if (conversations.indexOf('<conversation>') == -1) {
                    conversations = '<conversation>' + conversations + '</conversation>';
                }

                var htmlDoc = parser.parseFromString(conversations, "text/html");
                var defaultReplyNodes = htmlDoc.getElementsByTagName("default-reply");
                var defaultReply = null;

                if (defaultReplyNodes.length > 1) {
                    throw new Error('More than one default reply in conversation for person ' + person.id + '.');
                }
                else if (defaultReplyNodes.length === 1) {
                    defaultReply = defaultReplyNodes[0].innerHTML.trim();
                }

                var conversationNodes = htmlDoc.getElementsByTagName("node");

                person.conversation.nodes = [];

                for (var i = 0; i < conversationNodes.length; i++) {
                    var node = conversationNodes[i];
                    var nameAttribute = node.attributes['name'] && <string>node.attributes['name'].nodeValue;

                    if (!nameAttribute && console) {
                        console.log('Missing name attribute on node for conversation for person ' + person.id + '. Using \'default\' as default name');
                        nameAttribute = 'default';
                    }

                    if (person.conversation.nodes.some((node) => { return node.node == nameAttribute; })) {
                        throw new Error('Duplicate nodes with name ' + name + ' for conversation for person ' + person.id + '.');
                    }

                    var newNode = <IConversationNode>{
                        node: nameAttribute,
                        lines: '',
                        replies: null,
                    };

                    for (var j = 0; j < node.childNodes.length; j++) {
                        var replies = node.childNodes[j];

                        if (replies.nodeName.toLowerCase() == 'replies') {
                            var addDefaultValue = self.GetNodeValue(replies, 'default-reply');
                            var addDefaultReply = addDefaultValue && addDefaultValue.toLowerCase() === 'false' ? false : true;

                            newNode.replies = <IConversationReplies>{
                                defaultReply: <boolean>addDefaultReply,
                                options: <ICollection<IConversationReply>>[]
                            };

                            for (var k = 0; k < replies.childNodes.length; k++) {
                                var replyNode = replies.childNodes[k];

                                if (replyNode.nodeName.toLowerCase() == 'reply') {
                                    var requires = self.GetNodeValue(replyNode, 'requires');
                                    var linkToNode = self.GetNodeValue(replyNode, 'node');
                                    var trigger = self.GetNodeValue(replyNode, 'trigger');
                                    var questStart = self.GetNodeValue(replyNode, 'quest-start');
                                    var questComplete = self.GetNodeValue(replyNode, 'quest-complete');
                                    var setStart = self.GetNodeValue(replyNode, 'set-start');

                                    if (trigger && !person.conversation.actions[trigger]) {
                                        console.log('No action ' + trigger + ' for node ' + newNode.node + ' found.');
                                    }

                                    var reply = <IConversationReply>{
                                        requires: requires,
                                        linkToNode: linkToNode,
                                        trigger: trigger,
                                        questStart: questStart,
                                        questComplete: questComplete,
                                        setStart: setStart,
                                        lines: (<any>replyNode).innerHTML.trim(),
                                    };

                                    newNode.replies.options.push(reply);
                                }
                            }

                            node.removeChild(replies);

                            if (defaultReply && newNode.replies.defaultReply) {
                                newNode.replies.options.push(<IConversationReply>{
                                    lines: defaultReply
                                });
                            }
                        }
                    }

                    if (!newNode.replies && defaultReply) {
                        newNode.replies = <IConversationReplies>{
                            defaultReply: true,
                            options: <ICollection<IConversationReply>>[
                                {
                                    lines: defaultReply
                                }
                            ]
                        }
                    }

                    newNode.lines = node.innerHTML.trim();
                    person.conversation.nodes.push(newNode);
                }

                person.conversation.nodes.forEach(n => {
                    if (n.replies && n.replies.options)
                    {
                        n.replies.options.forEach(r => {
                            if (r.linkToNode && !person.conversation.nodes.some(n => n.node === r.linkToNode)) {
                                console.log('No node ' + r.linkToNode + ' to link to found for node ' + n.node + '.');
                            }

                            if (r.setStart && !person.conversation.nodes.some(n => n.node === r.setStart)) {
                                console.log('No new start node ' + r.setStart + ' found for node ' + n.node + '.');
                            }
                        });
                    }
                });

                var nodeToSelect = person.conversation.nodes.filter(n => person.conversation.activeNode && n.node === person.conversation.activeNode.node);
                person.conversation.activeNode = nodeToSelect.length === 1 ? nodeToSelect[0] : null;
            });
        }

        private GetNodeValue(node: Node, attribute: string): string {
            return (<any>node).attributes[attribute] && (<any>node).attributes[attribute].value
        }

        private loadLocationDescriptions(game: IGame) {
            var self = this;

            if (game.currentLocation.descriptions) {
                self.selectLocationDescription(game);
                return;
            }

            var descriptions = self._dataService.loadDescription('locations', game.currentLocation);
            var parser = new DOMParser();

            if (descriptions.indexOf('<descriptions>') == -1) {
                descriptions = '<descriptions>' + descriptions + '</descriptions>';
            }

            var htmlDoc = parser.parseFromString(descriptions, "text/html");
            var descriptionNodes = htmlDoc.getElementsByTagName("description");
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

            var featureNodes = htmlDoc.getElementsByTagName("feature");

            if (game.currentLocation.features) {
                for (var i = 0; i < featureNodes.length; i++) {
                    var node = featureNodes[i];
                    var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;

                    if (!nameAttribute) {
                        throw new Error('There is no name attribute for a feature node for location ' + game.currentLocation.id + '.');
                    }

                    nameAttribute = nameAttribute.toLowerCase();

                    if (!game.currentLocation.features.some(f => f.name.toLowerCase() === nameAttribute)) {
                        throw new Error('There is no feature with name ' + nameAttribute + ' for location ' + game.currentLocation.id + '.');
                    }

                    game.currentLocation.features.filter(f => f.name.toLowerCase() === nameAttribute)[0].description = node.innerHTML;
                }
            }

            self.selectLocationDescription(game);
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
        // Also set the barrier selected actions to the first one available for each barrier.
        // Further, instantiate any keys present and replace combine functions with their target ids.
        destination.target = (<any>destination.target).name;

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
                    combination.target = (<any>combination.target).name;
                }
            }
        }
    }
}