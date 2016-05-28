var StoryScript;
(function (StoryScript) {
    var CharacterService = (function () {
        function CharacterService(dataService, ruleService) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
        }
        CharacterService.prototype.$get = function (dataService, ruleService) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
            return {
                createCharacter: self.createCharacter
            };
        };
        CharacterService.prototype.createCharacter = function (characterData) {
            var self = this;
            var character = self.dataService.load(StoryScript.DataKeys.CHARACTER);
            if (StoryScript.isEmpty(character)) {
                character = self.ruleService.createCharacter(characterData);
            }
            if (StoryScript.isEmpty(character.items)) {
                character.items = [];
            }
            return character;
        };
        return CharacterService;
    }());
    StoryScript.CharacterService = CharacterService;
    CharacterService.$inject = ['dataService', 'ruleService'];
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var DataService = (function () {
        function DataService($q, $http, $localStorage) {
            this.definitionCollection = window['StoryScript'];
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
        }
        DataService.prototype.$get = function ($q, $http, $localStorage) {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            return {
                getDescription: self.getDescription,
                save: self.save,
                load: self.load
            };
        };
        DataService.prototype.getDescription = function (descriptionId) {
            var self = this;
            var deferred = self.$q.defer();
            var url = '/locations/' + descriptionId + '.html';
            self.$http.get(url)
                .success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
                error(function (data, status, headers, config) {
                deferred.reject();
            });
            return deferred.promise;
        };
        DataService.prototype.save = function (key, value) {
            var self = this;
            var clone = self.cloneAndTransform(value, null);
            self.$localStorage[key] = JSON.stringify({ data: clone });
        };
        DataService.prototype.load = function (key) {
            var self = this;
            try {
                var savedValue = JSON.parse(self.$localStorage[key]).data;
                savedValue = self.restoreCollectionsAndFunctions(savedValue);
                return savedValue;
            }
            catch (exception) {
                console.log('No data loaded for key ' + key);
            }
        };
        DataService.prototype.cloneAndTransform = function (item, chainPointer) {
            var self = this;
            if (!item) {
                return;
            }
            var clone = {};
            chainPointer = chainPointer || '';
            if (typeof item !== "object") {
                return item;
            }
            if (item.id) {
                chainPointer += '_' + item.id;
            }
            if (item.target) {
                chainPointer += '_' + item.target;
            }
            for (var key in item) {
                if (!item.hasOwnProperty(key)) {
                    continue;
                }
                // Ignore combat actions, they should be reapplied on init combat when a location loads.
                if (key == 'combatActions') {
                    continue;
                }
                var value = item[key];
                var definitionKey = self.toDefinitionKey(key);
                if (self.definitionCollection.hasOwnProperty(definitionKey)) {
                    clone[key] = [];
                    for (var n in value) {
                        // For collections, point to the default object. This allows restoring functions on items added to collections
                        // at runtime.
                        var pointer = self.definitionCollection[definitionKey] && self.definitionCollection[definitionKey][n] ? '_' + definitionKey : chainPointer + '_' + key;
                        clone[key].push(self.cloneAndTransform(value[n], pointer));
                    }
                }
                else if (typeof value === "object" && value) {
                    clone[key] = self.cloneAndTransform(item[key], chainPointer + '_' + key);
                }
                else if (typeof value == 'function') {
                    clone[key] = self.getFunctionPointerOrStringValue(chainPointer, item, key);
                }
                else {
                    clone[key] = value;
                }
            }
            return clone;
        };
        DataService.prototype.getFunctionPointerOrStringValue = function (chainPointer, item, key) {
            var self = this;
            // Check whether the function exists on the original entity. If it does, return a pointer
            // to that function. If it does not, the function was added at runtime and must be saved
            // as a string.
            var pointerParts = chainPointer.split('_');
            pointerParts.shift();
            // Is there a definition collection for this pointer?
            var definitionCollection = self.definitionCollection[self.toDefinitionKey(pointerParts[0])];
            var original;
            if (definitionCollection) {
                // Get the original entity.
                original = definitionCollection[self.toDefinitionKey(pointerParts[1])]();
                if (original) {
                    pointerParts.shift();
                    pointerParts.shift();
                    // Traverse the original entity and its collections to get to the key value;
                    for (var i = 0; i < pointerParts.length; i++) {
                        //if (original.first) {
                        //    original = original.first(pointerParts[i]);
                        //}
                        //else {
                        original = original[pointerParts[i]];
                        //}
                        if (!original) {
                            break;
                        }
                    }
                }
            }
            if (!original || !original[key]) {
                original = self.definitionCollection.Actions[key];
                if (original) {
                    return '_fp_actions_' + key;
                }
                else {
                    return item[key].toString();
                }
            }
            // Either there is no definition collection or the original also has the function. Return
            // the function pointer.
            return '_fp' + chainPointer;
        };
        DataService.prototype.restoreCollectionsAndFunctions = function (item) {
            var self = this;
            if (!item) {
                return;
            }
            if (typeof item !== "object") {
                return item;
            }
            var arrayObject = StoryScript.convertOjectToArray(item);
            if (arrayObject) {
                item = arrayObject;
                for (var n in arrayObject) {
                    self.restoreCollectionsAndFunctions(arrayObject[n]);
                }
                return item;
            }
            for (var key in item) {
                if (!item.hasOwnProperty(key)) {
                    continue;
                }
                var value = item[key];
                if (value) {
                    if (typeof value === "object") {
                        arrayObject = StoryScript.convertOjectToArray(item[key]);
                        if (arrayObject) {
                            item[key] = arrayObject;
                            for (var n in arrayObject) {
                                self.restoreCollectionsAndFunctions(arrayObject[n]);
                            }
                        }
                        else {
                            self.restoreCollectionsAndFunctions(item[key]);
                        }
                    }
                    if (typeof value === 'string') {
                        if (value.substring(0, 3) === '_fp') {
                            var pointerParts = value.split('_');
                            pointerParts.shift();
                            pointerParts.shift();
                            var functionPointer = self.definitionCollection;
                            for (var n in pointerParts) {
                                //if (functionPointer.toString() === 'adventureGame.Collection' || functionPointer.toString() === 'adventureGame.DefinitionCollection') {
                                //    functionPointer = functionPointer.find(pointerParts[n]);
                                //}
                                //else {
                                functionPointer = functionPointer[pointerParts[n]];
                            }
                            item[key] = functionPointer[key];
                        }
                        else if (value.indexOf('function ') == 0) {
                            item[key] = eval('(' + value + ')');
                        }
                    }
                }
            }
            return item;
        };
        DataService.prototype.toDefinitionKey = function (text) {
            return text.substring(0, 1).toUpperCase() + text.substring(1);
        };
        return DataService;
    }());
    StoryScript.DataService = DataService;
    DataService.$inject = ['$q', '$http', '$localStorage'];
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var GameService = (function () {
        function GameService(dataService, locationService, characterService, ruleService, game) {
            var _this = this;
            this.init = function () {
                var self = _this;
                self.ruleService.setupGame(self.game);
                self.locationService.init(self.game);
                self.game.highScores = self.dataService.load(StoryScript.DataKeys.HIGHSCORES);
                self.game.character = self.dataService.load(StoryScript.DataKeys.CHARACTER);
                var locationName = self.dataService.load(StoryScript.DataKeys.LOCATION);
                if (locationName) {
                    var lastLocation = self.game.locations.first(locationName);
                    var previousLocationName = self.dataService.load(StoryScript.DataKeys.PREVIOUSLOCATION);
                    if (previousLocationName) {
                        self.game.previousLocation = self.game.locations.first(previousLocationName);
                    }
                    self.locationService.changeLocation(lastLocation, self.game);
                    self.game.state = 'play';
                }
                else {
                    self.game.state = 'createCharacter';
                }
                self.game.rollDice = self.rollDice;
            };
            this.reset = function () {
                var self = _this;
                self.dataService.save(StoryScript.DataKeys.WORLD, {});
                //dataService.save(game.keys.HIGHSCORES, []);
                self.locationService.init(self.game);
                var location = self.dataService.load(StoryScript.DataKeys.LOCATION);
                if (location) {
                    self.locationService.changeLocation(location, self.game);
                }
            };
            this.startNewGame = function (characterData) {
                var self = _this;
                self.game.character = self.characterService.createCharacter(characterData);
                self.dataService.save(StoryScript.DataKeys.CHARACTER, self.game.character);
                self.ruleService.startGame();
            };
            this.restart = function () {
                var self = _this;
                self.dataService.save(StoryScript.DataKeys.CHARACTER, {});
                self.dataService.save(StoryScript.DataKeys.LOCATION, '');
                self.dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, '');
                self.dataService.save(StoryScript.DataKeys.WORLD, {});
                self.init();
            };
            this.saveGame = function () {
                var self = _this;
                self.dataService.save(StoryScript.DataKeys.CHARACTER, self.game.character);
                self.dataService.save(StoryScript.DataKeys.WORLD, { Locations: self.game.locations });
            };
            this.rollDice = function (input) {
                //'xdy+/-z'
                var positiveModifier = input.indexOf('+') > -1;
                var splitResult = input.split('d');
                var numberOfDice = parseInt(splitResult[0]);
                splitResult = positiveModifier ? splitResult[1].split('+') : splitResult[1].split('-');
                var dieCount = parseInt(splitResult[0]);
                var bonus = parseInt(splitResult[1]);
                bonus = isNaN(bonus) ? 0 : bonus;
                bonus = positiveModifier ? bonus : bonus * -1;
                var result = 0;
                for (var i = 0; i < numberOfDice; i++) {
                    result += Math.floor(Math.random() * dieCount + 1);
                }
                result += bonus;
                return result;
            };
            var self = this;
            self.dataService = dataService;
            self.locationService = locationService;
            self.characterService = characterService;
            self.ruleService = ruleService;
            self.game = game;
        }
        GameService.prototype.$get = function (dataService, locationService, characterService, ruleService, game) {
            var self = this;
            self.dataService = dataService;
            self.locationService = locationService;
            self.characterService = characterService;
            self.ruleService = ruleService;
            self.game = game;
            return {
                init: self.init,
                startNewGame: self.startNewGame,
                reset: self.reset,
                restart: self.restart,
                saveGame: self.saveGame,
                rollDice: null
            };
        };
        return GameService;
    }());
    StoryScript.GameService = GameService;
    GameService.$inject = ['dataService', 'locationService', 'characterService', 'ruleService', 'game'];
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    if (Function.prototype.proxy === undefined) {
        Function.prototype.proxy = function (proxyFunction) {
            var self = this;
            return (function () {
                return function () {
                    var args = [].slice.call(arguments);
                    args.splice(0, 0, self);
                    return proxyFunction.apply(this, args);
                };
            })();
        };
    }
    function isEmpty(object, property) {
        var objectToCheck = property ? object[property] : object;
        return objectToCheck ? Object.keys(objectToCheck).length === 0 : true;
    }
    StoryScript.isEmpty = isEmpty;
    function addFunctionExtensions() {
        // Need to cast to any for ES5 and lower
        if (Function.prototype.name === undefined) {
            Object.defineProperty(Function.prototype, 'name', {
                get: function () {
                    return /function ([^(]*)/.exec(this + "")[1];
                }
            });
        }
    }
    StoryScript.addFunctionExtensions = addFunctionExtensions;
    function addArrayExtensions() {
        Object.defineProperty(Array.prototype, 'first', {
            enumerable: false,
            value: function (id) {
                if (id) {
                    return find(id, this)[0];
                }
                else {
                    return this[0];
                }
            }
        });
        Object.defineProperty(Array.prototype, 'all', {
            enumerable: false,
            value: function (id) {
                return find(id, this);
            }
        });
        Object.defineProperty(Array.prototype, 'remove', {
            enumerable: false,
            value: function (item) {
                // Need to cast to any for ES5 and lower
                var index = Array.prototype.findIndex.call(this, function (x) {
                    return x === item || (item.id && x.id && item.id === x.id);
                });
                if (index != -1) {
                    Array.prototype.splice.call(this, index, 1);
                }
            }
        });
    }
    StoryScript.addArrayExtensions = addArrayExtensions;
    function definitionToObject(definition) {
        var item = definition();
        // todo: type
        // Need to cast to any for ES5 and lower
        item.id = definition.name;
        return item;
    }
    StoryScript.definitionToObject = definitionToObject;
    function convertOjectToArray(item) {
        var isArray = !isEmpty(item);
        for (var n in item) {
            if (isNaN(parseInt(n))) {
                isArray = false;
                break;
            }
        }
        if (!isArray) {
            return;
        }
        var newArray = [];
        for (var n in item) {
            newArray.push(item[n]);
        }
        return newArray;
    }
    StoryScript.convertOjectToArray = convertOjectToArray;
    var DataKeys = (function () {
        function DataKeys() {
        }
        DataKeys.HIGHSCORES = 'highScores';
        DataKeys.CHARACTER = 'character';
        DataKeys.LOCATION = 'location';
        DataKeys.PREVIOUSLOCATION = 'previousLocation';
        DataKeys.WORLD = 'world';
        return DataKeys;
    }());
    StoryScript.DataKeys = DataKeys;
    function find(id, array) {
        if (typeof id === 'function') {
            id = id.name;
        }
        return Array.prototype.filter.call(array, matchById(id));
    }
    function matchById(id) {
        return function (x) {
            return x.id === id || (x.target && x.target === id || (typeof x.target === 'function' && x.target.name === id));
        };
    }
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var LocationService = (function () {
        function LocationService(dataService, ruleService) {
            var _this = this;
            this.init = function (game) {
                var self = _this;
                game.changeLocation = function (location) { self.changeLocation.call(self, location, game); };
                game.currentLocation = null;
                game.previousLocation = null;
                game.locations = self.loadWorld();
            };
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
        }
        LocationService.prototype.$get = function (dataService, ruleService) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
            return {
                loadWorld: self.loadWorld,
                changeLocation: self.changeLocation,
                init: self.init
            };
        };
        LocationService.prototype.loadWorld = function () {
            var self = this;
            //self.locations = <ICollection<ICompiledLocation>>self.dataService.load<any>(DataKeys.WORLD).Locations;
            if (StoryScript.isEmpty(self.locations)) {
                self.buildWorld();
            }
            // Add a proxy to the destination collection push function, to replace the target function pointer
            // with the target id when adding destinations and enemies at runtime.
            self.locations.forEach(function (location) {
                location.destinations = location.destinations || [];
                location.destinations.push = location.destinations.push.proxy(self.addDestination);
                location.enemies = location.enemies || [];
                location.enemies.push = location.enemies.push.proxy(self.addEnemy);
                location.combatActions = location.combatActions || [];
            });
            return self.locations;
        };
        LocationService.prototype.changeLocation = function (location, game) {
            var self = this;
            // If no location is specified, go to the previous location.
            if (!location) {
                var tempLocation = game.currentLocation;
                game.currentLocation = game.previousLocation;
                game.previousLocation = tempLocation;
                // Todo: can this be typed somehow?
                location = game.currentLocation;
            }
            else if (game.currentLocation) {
                game.previousLocation = game.currentLocation;
            }
            var key = typeof location == 'function' ? location.name : location.id ? location.id : location;
            game.currentLocation = game.locations.first(key);
            // remove the return message from the current location destinations.
            if (game.currentLocation.destinations) {
                game.currentLocation.destinations.forEach(function (destination) {
                    if (destination.isPreviousLocation) {
                        destination.isPreviousLocation = false;
                    }
                });
            }
            // Mark the previous location in the current location's destinations to allow
            // the player to more easily backtrack his last step. Also, check if the user
            // has the key for one or more barriers at this location, and add the key actions
            // if that is the case.
            if (game.currentLocation.destinations) {
                game.currentLocation.destinations.forEach(function (destination) {
                    if (destination.target && destination.target == game.previousLocation.id) {
                        destination.isPreviousLocation = true;
                    }
                    if (destination.barrier && destination.barrier.key) {
                        key = game.character.items.first(destination.barrier.key);
                        if (key) {
                            // Todo: can this be typed somehow?
                            destination.barrier.actions.openWithKey = key.open();
                        }
                    }
                });
            }
            // Save the previous and current location, then get the location text.
            self.dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);
            self.dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
            self.loadLocationDescriptions(game);
            self.ruleService.initCombat(game.currentLocation);
            self.ruleService.enterLocation(game.currentLocation);
            // If the player hasn't been here before, play the location events.
            if (!game.currentLocation.hasVisited) {
                game.currentLocation.hasVisited = true;
                self.playEvents(game);
            }
        };
        LocationService.prototype.buildWorld = function () {
            var self = this;
            self.locations = [];
            var locations = window['StoryScript']['Locations'];
            for (var n in locations) {
                var definition = locations[n];
                var location = StoryScript.definitionToObject(definition);
                location.id = definition.name;
                if (!location.destinations) {
                    console.log('No destinations specified for location ' + location.id);
                }
                self.setDestinations(location);
                self.buildEnemies(location);
                self.buildItems(location);
                self.locations.push(location);
            }
        };
        LocationService.prototype.setDestinations = function (location) {
            var self = this;
            // Replace the function pointers for the destination targets with the function keys.
            // That's all that is needed to navigate, and makes it easy to save these targets.
            // Also set the barrier selected actions to the first one available for each barrier.
            if (location.destinations) {
                location.destinations.forEach(function (destination) {
                    //if (typeof destination.target == 'function') {
                    destination.target = destination.target.name;
                    //}
                    if (destination.barrier) {
                        if (destination.barrier.actions && destination.barrier.actions.length > 0) {
                            destination.barrier.selectedAction = destination.barrier.actions[0];
                        }
                    }
                });
            }
        };
        LocationService.prototype.buildEnemies = function (location) {
            var self = this;
            if (location.enemies) {
                var enemies = [];
                location.enemies.forEach(function (enDef) {
                    var enemy = StoryScript.definitionToObject(enDef);
                    self.buildItems(enemy);
                    enemies.push(enemy);
                });
                location.enemies = enemies;
            }
        };
        LocationService.prototype.buildItems = function (entry) {
            var self = this;
            if (entry.items) {
                var items = [];
                entry.items.forEach(function (itemDef) {
                    var item = StoryScript.definitionToObject(itemDef);
                    items.push(item);
                });
                entry.items = items;
            }
        };
        LocationService.prototype.addDestination = function () {
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();
            // Replace the target function pointer with the target id.
            for (var n in args) {
                var param = args[n];
                param.target = param.target.name;
            }
            originalFunction.apply(this, args);
        };
        LocationService.prototype.addEnemy = function (game) {
            var self = this;
            var args = [].slice.apply(arguments);
            var originalFunction = args.shift();
            var enemy = originalFunction.apply(this, args);
            self.ruleService.addEnemyToLocation(game.currentLocation, enemy);
        };
        LocationService.prototype.playEvents = function (game) {
            var self = this;
            for (var n in game.currentLocation.events) {
                game.currentLocation.events[n](game);
            }
        };
        LocationService.prototype.loadLocationDescriptions = function (game) {
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
                    var descriptionSelector = game.currentLocation.defaultDescriptionSelector;
                    game.currentLocation.text = descriptionSelector ? descriptionSelector() : game.currentLocation.descriptions['default'];
                }
                // If the description selector did not return a text, use the default description.
                if (!game.currentLocation.text) {
                    game.currentLocation.text = game.currentLocation.descriptions['default'];
                }
            });
        };
        return LocationService;
    }());
    StoryScript.LocationService = LocationService;
    LocationService.$inject = ['dataService', 'ruleService'];
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var MainController = (function () {
        function MainController($scope, $window, locationService, ruleService, gameService, game) {
            var _this = this;
            this.startNewGame = function () {
                var self = _this;
                self.gameService.startNewGame(self.createCharacterForm);
                self.game.state = 'play';
            };
            this.restart = function () {
                var self = _this;
                self.gameService.restart();
                self.init();
            };
            this.getButtonClass = function (action) {
                var type = action.type || 'move';
                var buttonClass = 'btn-';
                switch (type) {
                    case 'move':
                        {
                            buttonClass += 'info';
                        }
                        break;
                    case 'skill':
                        {
                            buttonClass += 'warning';
                        }
                        break;
                    case 'fight':
                        {
                            buttonClass += 'danger';
                        }
                        break;
                }
                return buttonClass;
            };
            this.getActionName = function (barrier, action) {
                // Get the name of the barrier action from the barrier without the need to specify it
                // in the definition.
                for (var n in barrier.actions) {
                    var currentAction = barrier.actions[n];
                    if (currentAction == action) {
                        return n;
                    }
                }
            };
            this.enemiesPresent = function () {
                var self = _this;
                return self.game.currentLocation.enemies.length;
            };
            this.barriersPresent = function () {
                var self = _this;
                return self.game.currentLocation.destinations && self.game.currentLocation.destinations.some(function (destination) { return !StoryScript.isEmpty(destination.barrier); });
            };
            this.actionsPresent = function () {
                var self = _this;
                return !self.enemiesPresent() && !StoryScript.isEmpty(self.game.currentLocation.actions);
            };
            this.disableActionButton = function (action) {
                var self = _this;
                return typeof action.active === "function" ? !action.active(self.game) : action.active == undefined ? false : !action.active;
            };
            this.executeBarrierAction = function (destination, barrier) {
                var self = _this;
                // Get the selected action manually because ng-options does not work and I have to use ng-repeat
                // which does not supply a full object.
                var action = barrier.actions[barrier.selectedAction];
                var args = [action.action, destination, barrier, action];
                self.executeAction.apply(_this, args);
            };
            this.changeLocation = function (location) {
                var self = _this;
                // Call changeLocation without using the execute action as the game parameter is not needed.
                self.game.changeLocation(location);
                self.gameService.saveGame();
            };
            this.pickupItem = function (item) {
                var self = _this;
                self.game.character.items.push(item);
                self.game.currentLocation.items.remove(item);
            };
            this.dropItem = function (item) {
                var self = _this;
                self.game.character.items.remove(item);
                self.game.currentLocation.items.push(item);
            };
            this.equip = function (item) {
                var self = _this;
                var equippedItem = self.game.character.equipment[item.equipmentType];
                if (equippedItem) {
                    self.game.character.items.push(equippedItem);
                }
                self.game.character.equipment[item.equipmentType] = item;
                self.game.character.items.remove(item);
            };
            var self = this;
            self.$scope = $scope;
            self.$window = $window;
            self.locationService = locationService;
            self.ruleService = ruleService;
            self.gameService = gameService;
            self.game = game;
            self.init();
        }
        // Todo: can this be done differently?
        MainController.prototype.reset = function () { };
        ;
        MainController.prototype.init = function () {
            var self = this;
            self.gameService.init();
            self.createCharacterForm = self.ruleService.getCharacterForm();
            self.reset = function () { self.gameService.reset.call(self.gameService); };
        };
        MainController.prototype.executeAction = function (action) {
            var self = this;
            if (action && typeof action === 'function') {
                // Modify the arguments collection to add the game to the collection before
                // calling the function specified.
                var args = [].slice.call(arguments);
                args.shift();
                args.splice(0, 0, self.game);
                action.apply(this, args);
                // After each action, save the game.
                self.gameService.saveGame();
            }
        };
        return MainController;
    }());
    StoryScript.MainController = MainController;
    MainController.$inject = ['$scope', '$window', 'locationService', 'ruleService', 'gameService', 'game'];
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    (function (EquipmentType) {
        EquipmentType[EquipmentType["Head"] = 0] = "Head";
        EquipmentType[EquipmentType["Amulet"] = 1] = "Amulet";
        EquipmentType[EquipmentType["Hands"] = 2] = "Hands";
        EquipmentType[EquipmentType["LeftHand"] = 3] = "LeftHand";
        EquipmentType[EquipmentType["LeftRing"] = 4] = "LeftRing";
        EquipmentType[EquipmentType["RightHand"] = 5] = "RightHand";
        EquipmentType[EquipmentType["RightRing"] = 6] = "RightRing";
        EquipmentType[EquipmentType["Body"] = 7] = "Body";
        EquipmentType[EquipmentType["Legs"] = 8] = "Legs";
        EquipmentType[EquipmentType["Feet"] = 9] = "Feet";
        EquipmentType[EquipmentType["Miscellaneous"] = 10] = "Miscellaneous";
    })(StoryScript.EquipmentType || (StoryScript.EquipmentType = {}));
    var EquipmentType = StoryScript.EquipmentType;
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    StoryScript.addFunctionExtensions();
    StoryScript.addArrayExtensions();
    var storyScriptModule = angular.module("storyscript", ['ngSanitize', 'ngStorage']);
    var game = {};
    storyScriptModule.value('game', game);
    storyScriptModule.service("dataService", StoryScript.DataService);
    storyScriptModule.service("locationService", StoryScript.LocationService);
    storyScriptModule.service("characterService", StoryScript.CharacterService);
    storyScriptModule.service("gameService", StoryScript.GameService);
    storyScriptModule.controller("MainController", StoryScript.MainController);
})(StoryScript || (StoryScript = {}));
var DangerousCave;
(function (DangerousCave) {
    var Character = (function () {
        function Character() {
            this.hitpoints = 20;
            this.currentHitpoints = 20;
            this.level = 1;
            this.kracht = 1;
            this.vlugheid = 1;
            this.oplettendheid = 1;
            this.defense = 1;
            this.items = [];
            this.equipment = {
                head: null,
                amulet: null,
                body: null,
                hands: null,
                leftHand: null,
                leftRing: null,
                rightHand: null,
                rightRing: null,
                legs: null,
                feet: null
            };
        }
        return Character;
    }());
    DangerousCave.Character = Character;
})(DangerousCave || (DangerousCave = {}));
var DangerousCave;
(function (DangerousCave) {
    var Game = (function () {
        function Game() {
            this.logToLocationLog = function (message) { };
            this.logToActionLog = function (message) { };
        }
        // Todo: only to overwrite. Use interface? Better typing?
        Game.prototype.changeLocation = function (location) { };
        Game.prototype.rollDice = function (dice) { return 0; };
        return Game;
    }());
    DangerousCave.Game = Game;
})(DangerousCave || (DangerousCave = {}));
var DangerousCave;
(function (DangerousCave) {
    var LevelUpController = (function () {
        function LevelUpController($scope, ruleService, game) {
            var _this = this;
            this.levelUp = function () {
                var self = _this;
                self.ruleService.levelUp(self.selectedReward.name);
            };
            var self = this;
            self.$scope = $scope;
            self.ruleService = ruleService;
            self.game = game;
            self.init();
        }
        LevelUpController.prototype.init = function () {
            var self = this;
        };
        return LevelUpController;
    }());
    DangerousCave.LevelUpController = LevelUpController;
    LevelUpController.$inject = ['$scope', 'ruleService', 'game'];
    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.controller("LevelUpController", LevelUpController);
})(DangerousCave || (DangerousCave = {}));
var DangerousCave;
(function (DangerousCave) {
    var RuleService = (function () {
        function RuleService(game) {
            var _this = this;
            this.setupGame = function (game) {
                game.highScores = [];
                game.actionLog = [];
                game.logToLocationLog = function (message) {
                    game.currentLocation.log = game.currentLocation.log || [];
                    game.currentLocation.log.push(message);
                };
                game.logToActionLog = function (message) {
                    game.actionLog.splice(0, 0, message);
                };
            };
            this.levelUp = function (reward) {
                var self = _this;
                if (reward != 'gezondheid') {
                    self.game.character[reward]++;
                }
                else {
                    self.game.character.hitpoints += 10;
                    self.game.character.currentHitpoints += 10;
                }
                self.game.state = 'play';
            };
            var self = this;
            self.game = game;
        }
        RuleService.prototype.$get = function (game) {
            var self = this;
            self.game = game;
            return {
                setupGame: self.setupGame,
                getCharacterForm: self.getCharacterForm,
                createCharacter: self.createCharacter,
                startGame: self.startGame,
                addEnemyToLocation: self.addEnemyToLocation,
                enterLocation: self.enterLocation,
                initCombat: self.initCombat
            };
        };
        RuleService.prototype.getCharacterForm = function () {
            return {
                specialties: [
                    {
                        name: 'sterk',
                        value: 'Sterk'
                    },
                    {
                        name: 'snel',
                        value: 'Snel'
                    },
                    {
                        name: 'slim',
                        value: 'Slim'
                    }
                ],
                items: [
                    StoryScript.Items.Dagger(),
                    StoryScript.Items.LeatherHelmet(),
                    StoryScript.Items.Lantern()
                ]
            };
        };
        RuleService.prototype.createCharacter = function (characterData) {
            var self = this;
            var character = new DangerousCave.Character();
            character.name = characterData.name;
            switch (characterData.selectedSpecialty.name) {
                case 'sterk':
                    {
                        character.kracht++;
                    }
                    break;
                case 'snel':
                    {
                        character.vlugheid++;
                    }
                    break;
                case 'slim':
                    {
                        character.oplettendheid++;
                    }
                    break;
            }
            character.items.push(characterData.selectedItem);
            return character;
        };
        RuleService.prototype.startGame = function () {
            var self = this;
            self.game.changeLocation(self.game.locations.first(StoryScript.Locations.Start));
        };
        RuleService.prototype.addEnemyToLocation = function (location, enemy) {
            var self = this;
            self.addFleeAction(location);
        };
        RuleService.prototype.enterLocation = function (location) {
            var self = this;
            self.game.logToActionLog('Je komt aan in ' + location.name);
            if (location.id != 'start' && !location.hasVisited) {
                self.game.character.score += 1;
            }
        };
        RuleService.prototype.initCombat = function (location) {
            var self = this;
            // Log the presense of enemies to the action log.
            location.enemies.forEach(function (enemy) {
                self.game.logToActionLog('Er is hier een ' + enemy.name);
            });
            self.addFleeAction(location);
        };
        RuleService.prototype.addFleeAction = function (location) {
            var self = this;
            var numberOfEnemies = location.enemies.length;
            var fleeAction = location.combatActions.first(StoryScript.Actions.Flee);
            if (fleeAction) {
                delete location.combatActions.splice(location.combatActions.indexOf(fleeAction), 1);
            }
            if (numberOfEnemies < self.game.character.vlugheid) {
                location.combatActions.push(StoryScript.Actions.Flee(''));
            }
        };
        return RuleService;
    }());
    DangerousCave.RuleService = RuleService;
    RuleService.$inject = ['game'];
    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("ruleService", RuleService);
})(DangerousCave || (DangerousCave = {}));
var DangerousCave;
(function (DangerousCave) {
    var TextService = (function () {
        function TextService() {
        }
        TextService.prototype.$get = function () {
            var self = this;
            return {
                createCharacter: self.createCharacter
            };
        };
        TextService.prototype.createCharacter = function () {
            return null;
        };
        return TextService;
    }());
    DangerousCave.TextService = TextService;
    //TextService.$inject = [];
    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
})(DangerousCave || (DangerousCave = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function Flee(text) {
            return {
                text: text || 'Vluchten!',
                type: 'fight',
                active: function (game) {
                    return !game.isEmpty(game.currentLocation, 'enemies');
                },
                execute: function (game) {
                    var check = game.rollDice(game.character.vlugheid + 'd6');
                    var result = check * game.character.vlugheid;
                    var totalHitpoints = 0;
                    game.currentLocation.enemies.forEach(function (enemy) {
                        totalHitpoints += enemy.hitpoints;
                    });
                    if (result >= totalHitpoints / 2) {
                        game.changeLocation();
                    }
                    else {
                        game.logAction('Je ontsnapping mislukt!');
                    }
                    ;
                }
            };
        }
        Actions.Flee = Flee;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function Heal(potency) {
            return function (game, item) {
                var healed = game.rollDice(potency);
                game.character.currentHitpoints += healed;
                if (item.charges) {
                    item.charges--;
                }
                if (!item.charges) {
                    game.character.items.remove(item);
                }
            };
        }
        Actions.Heal = Heal;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function Inspect(text) {
            return function (game, barrier, action) {
                for (var n in barrier.actions) {
                    var currentAction = barrier.actions.first(action);
                    if (currentAction == action) {
                        delete barrier.actions[n];
                        barrier.selectedAction = barrier.actions.first();
                    }
                }
                if (text) {
                    game.logToLocationLog(text);
                }
            };
        }
        Actions.Inspect = Inspect;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function Open(callback) {
            return function (game, destination) {
                delete destination.barrier;
                if (callback) {
                    callback(game, destination);
                }
            };
        }
        Actions.Open = Open;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function OpenWithKey(callBack) {
            return function (game, destination) {
                // Todo: remove the key used from the character's inventory.
                delete destination.barrier;
                if (callBack) {
                    callBack(game, destination);
                }
            };
        }
        Actions.OpenWithKey = OpenWithKey;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function RandomEnemy(game) {
            var enemies = window['StoryScript']['Enemies'];
            var enemyCount = 0;
            for (var n in enemies) {
                enemyCount++;
            }
            var randomEnemy = enemies[game.rollDice('1d' + enemyCount) - 1]();
            game.currentLocation.enemies.push(randomEnemy);
            return randomEnemy;
        }
        Actions.RandomEnemy = RandomEnemy;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function Search(settings) {
            var text = settings.text || 'Zoek';
            return {
                text: text,
                type: 'skill',
                active: settings.active == undefined ? function () { return true; } : settings.active,
                execute: function (game) {
                    var check = game.rollDice(game.character.oplettendheid + 'd6');
                    var result;
                    result = check * game.character.oplettendheid;
                    for (var n in game.currentLocation.actions) {
                        var action = game.currentLocation.actions[n];
                        if (action.text == text) {
                            delete game.currentLocation.actions[n];
                            break;
                        }
                    }
                    if (result >= settings.difficulty) {
                        settings.success(game);
                    }
                    else {
                        settings.fail(game);
                    }
                    ;
                }
            };
        }
        Actions.Search = Search;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        function Unlock(settings) {
            return {
                text: settings.text || 'Slot openen',
                type: 'skill',
                active: settings.active == undefined ? true : settings.active,
                execute: function (game) {
                    var check = game.rollDice(game.character.vlugheid + 'd6');
                    var result;
                    result = check * game.character.vlugheid;
                    if (result >= settings.difficulty) {
                        settings.success(game);
                    }
                    else {
                        settings.fail(game);
                        game.logToActionLog('Het lukt niet.');
                    }
                    ;
                }
            };
        }
        Actions.Unlock = Unlock;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));
//deze button moet active blijven, behalve bij een critical fail misschien. Dus een extra setting, kan dat? 
// Of kunnen we bijvoorbeeld drie pogingen geven voor hij inactive wordt? 
var StoryScript;
(function (StoryScript) {
    var Enemies;
    (function (Enemies) {
        function GiantBat() {
            return {
                name: 'Reuzenvleermuis',
                hitpoints: 7,
                attack: '1d6',
                reward: 1
            };
        }
        Enemies.GiantBat = GiantBat;
    })(Enemies = StoryScript.Enemies || (StoryScript.Enemies = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Enemies;
    (function (Enemies) {
        function Goblin() {
            return {
                name: 'Goblin',
                hitpoints: 6,
                attack: 'd4+3',
                reward: 1,
                items: [
                    StoryScript.Items.Dagger
                ]
            };
        }
        Enemies.Goblin = Goblin;
    })(Enemies = StoryScript.Enemies || (StoryScript.Enemies = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Enemies;
    (function (Enemies) {
        function Orc() {
            return {
                name: 'Ork',
                hitpoints: 12,
                attack: '2d4+1',
                reward: 1,
                items: [
                    StoryScript.Items.IronHelmet
                ]
            };
        }
        Enemies.Orc = Orc;
    })(Enemies = StoryScript.Enemies || (StoryScript.Enemies = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Enemies;
    (function (Enemies) {
        function Troll() {
            return {
                name: 'Trol',
                hitpoints: 20,
                attack: '2d6',
                reward: 2,
                items: [
                    StoryScript.Items.HealingPotion
                ]
            };
        }
        Enemies.Troll = Troll;
    })(Enemies = StoryScript.Enemies || (StoryScript.Enemies = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function HealingPotion() {
            return {
                name: 'Toverdrank',
                equipmentType: StoryScript.EquipmentType.Miscellaneous,
                use: StoryScript.Actions.Heal('1d8')
            };
        }
        Items.HealingPotion = HealingPotion;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function BlackKey() {
            return {
                name: 'Black key',
                description: 'This black iron key has a gargoyle figurine on it.',
                equipmentType: StoryScript.EquipmentType.Miscellaneous,
                open: {
                    text: 'Open de deur met de zwarte sleutel',
                    // Todo: does this work? How does the callback get access to the game and destination?
                    execute: function (parameters) { return StoryScript.Actions.OpenWithKey(function (game, destination) {
                        game.logToLocationLog('Je opent de deur.');
                        destination.text = 'Donkere kamer';
                    }); }
                }
            };
        }
        Items.BlackKey = BlackKey;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function Dagger() {
            return {
                name: 'Dolk',
                damage: '1',
                equipmentType: StoryScript.EquipmentType.LeftHand
            };
        }
        Items.Dagger = Dagger;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function IronHelmet() {
            return {
                name: 'Helm van ijzer',
                defense: 2,
                equipmentType: StoryScript.EquipmentType.Head
            };
        }
        Items.IronHelmet = IronHelmet;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function Lantern() {
            return {
                name: 'Lantaren',
                bonuses: {
                    perception: 1
                },
                equipmentType: StoryScript.EquipmentType.LeftHand
            };
        }
        Items.Lantern = Lantern;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function LeatherArmor() {
            return {
                name: 'Harnas van leer',
                defense: 2,
                equipmentType: StoryScript.EquipmentType.Body
            };
        }
        Items.LeatherArmor = LeatherArmor;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function LeatherHelmet() {
            return {
                name: 'Helm van leer',
                defense: 1,
                equipmentType: StoryScript.EquipmentType.Head
            };
        }
        Items.LeatherHelmet = LeatherHelmet;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function SmallShield() {
            return {
                name: 'Klein schild',
                defense: 2,
                equipmentType: StoryScript.EquipmentType.LeftHand
            };
        }
        Items.SmallShield = SmallShield;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Items;
    (function (Items) {
        function Sword() {
            return {
                name: 'Zwaard',
                damage: '3',
                equipmentType: StoryScript.EquipmentType.RightHand
            };
        }
        Items.Sword = Sword;
    })(Items = StoryScript.Items || (StoryScript.Items = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function Arena() {
            return {
                name: 'Een hoek van de grot waar kaarsen branden',
                enemies: [
                    StoryScript.Enemies.Orc
                ],
                destinations: [
                    {
                        text: 'De grote grot in',
                        target: Locations.CandleLitCave
                    }
                ],
                actions: [
                    {
                        text: 'Onderzoek symbool',
                        type: 'skill',
                        execute: function (game) {
                            game.currentLocation.text = game.currentLocation.descriptions['triggered'];
                            var troll = StoryScript.Enemies.Troll();
                            game.currentLocation.enemies.push(troll);
                            troll.onDefeat = onDefeat;
                            game.logToActionLog('Er verschijnt op magische wijze een enorme trol waar het symbool was! Hij valt je aan!');
                        }
                    }
                ]
            };
            function onDefeat(game) {
                var randomEnemy = StoryScript.Actions.RandomEnemy(game);
                randomEnemy.onDefeat = this.onDefeat;
            }
        }
        Locations.Arena = Arena;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function CandleLitCave() {
            return {
                name: 'Een grot met kaarslicht',
                destinations: [
                    {
                        text: 'Onderzoek het kaarslicht',
                        target: Locations.Arena
                    },
                    {
                        text: 'Sluip naar de donkere gang',
                        target: Locations.DarkCorridor
                    },
                    {
                        text: 'Richting ingang',
                        target: Locations.RightCorridor
                    }
                ],
                actions: [
                    StoryScript.Actions.Search({
                        difficulty: 12,
                        success: function (game) {
                            game.logToLocationLog('Je voelt dat hier kortgeleden sterke magie gebruikt is. Ook zie je aan sporen op de vloer dat hier vaak orks lopen.');
                        },
                        fail: function (game) {
                            game.logToActionLog('Terwijl je rondzoekt, struikel je over een losse steen en maak je veel herrie. Er komt een ork op af!');
                            game.currentLocation.enemies.push(StoryScript.Enemies.Orc());
                        }
                    })
                ]
            };
        }
        Locations.CandleLitCave = CandleLitCave;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function CentreRoom() {
            return {
                name: 'Een opslagkamer',
                destinations: [
                    {
                        text: 'De kamer van de ork',
                        target: Locations.RoomOne
                    }
                ],
                actions: [
                    StoryScript.Actions.Search({
                        difficulty: 9,
                        success: function (game) {
                            game.logToLocationLog('Je vindt een schild!');
                            // Todo: allow pushing definition instead of item.
                            game.character.items.push(StoryScript.Items.SmallShield());
                        },
                        fail: function (game) {
                            game.logToLocationLog('Je vindt niets.');
                        }
                    })
                ]
            };
        }
        Locations.CentreRoom = CentreRoom;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function CrossRoads() {
            return {
                name: 'Een kruispunt',
                events: [
                    function (game) {
                        var orkCorridor = game.locations.first(Locations.DarkCorridor);
                        var orkPresent = !orkCorridor.hasVisited;
                        if (game.character.oplettendheid > 2 && orkPresent) {
                            game.logToLocationLog('Je hoort vanuit de westelijke gang een snuivende ademhaling.');
                        }
                    }
                ],
                destinations: [
                    {
                        text: 'Donkere tunnel (oost)',
                        target: Locations.DarkCorridor
                    },
                    {
                        text: 'Nog niet! Gang (noord)',
                        target: Locations.Temp
                    },
                    {
                        text: 'Donkere tunnel (west)',
                        target: Locations.WestCrossing
                    },
                    {
                        text: 'Gang (zuid)',
                        target: Locations.RightCorridor
                    }
                ],
            };
        }
        Locations.CrossRoads = CrossRoads;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function DarkCorridor() {
            return {
                name: 'Een donkere smalle gang',
                enemies: [
                    StoryScript.Enemies.Orc
                ],
                destinations: [
                    {
                        text: 'Richting grote grot (oost)',
                        target: Locations.CandleLitCave
                    },
                    {
                        text: 'Richting kruispunt (west)',
                        target: Locations.CrossRoads
                    }
                ],
            };
        }
        Locations.DarkCorridor = DarkCorridor;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function DoorOne() {
            return {
                name: 'Een donkere gang met een deur',
                destinations: [
                    {
                        text: 'De kamer in',
                        target: Locations.RoomOne
                    },
                    {
                        text: 'Donkere gang',
                        target: Locations.LeftCorridor
                    }
                ],
                actions: [
                    {
                        text: 'Schop tegen de deur',
                        type: 'fight',
                        execute: function (game) {
                            var check = Math.floor(Math.random() * 6 + 1);
                            var result;
                            result = check * game.character.kracht;
                            if (result > 8) {
                                game.changeLocation(Locations.RoomOne);
                                game.logToLocationLog('Met een enorme klap schop je de deur doormidden. Je hoort een verrast gegrom en ziet een ork opspringen.');
                            }
                            else {
                                game.logToActionLog('Auw je tenen!! De deur is nog heel.');
                            }
                            ;
                        }
                    },
                    StoryScript.Actions.Unlock({
                        difficulty: 10,
                        success: function (game) {
                            game.changeLocation(Locations.RoomOne);
                            game.logToLocationLog('Met meegebrachte pinnetjes duw je in het slot op het mechanisme tot je een klik voelt. De deur is open!');
                            game.logToLocationLog('Je duwt de deur open en kijkt naar binnen.');
                        },
                        fail: function (game) {
                        }
                    }),
                    StoryScript.Actions.Search({
                        difficulty: 10,
                        success: function (game) {
                            game.logToLocationLog('Je tast de deur, vloer en muren af. Hoog aan de rechtermuur vind je aan een haakje een grote sleutel!');
                        },
                        fail: function (game) {
                            game.logToLocationLog('Je tast de deur, vloer en muren af. Stenen, hout en gruis. Je vindt niets nuttigs.');
                        }
                    })
                ]
            };
        }
        Locations.DoorOne = DoorOne;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function Entry() {
            return {
                name: 'De grot',
                // Example
                //descriptionSelector: function() {
                //    return game.currentLocation.descriptions['lantern'];
                //},
                //navigationDisabled: true,
                items: [
                    StoryScript.Items.Lantern,
                ],
                events: [
                    function (game) {
                        if (game.character.oplettendheid > 1) {
                            game.logToLocationLog('Je ruikt bloed.');
                        }
                    }
                ],
                destinations: [
                    {
                        text: 'Donkere gang (west)',
                        target: Locations.LeftCorridor
                    },
                    {
                        text: 'Schemerige gang (oost)',
                        target: Locations.RightCorridor
                    }
                ],
                actions: [
                    StoryScript.Actions.Search({
                        difficulty: 5,
                        success: function (game) {
                            game.logToLocationLog('Op de muur staat een pijl, getekend met bloed. Hij wijst naar de rechtergang.');
                        },
                        fail: function (game) {
                            game.logToLocationLog('Je vindt alleen stenen en stof.');
                        }
                    })
                ]
            };
        }
        Locations.Entry = Entry;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function LeftCorridor() {
            return {
                name: 'Een pikdonkere gang',
                events: [
                    function (game) {
                        var damage = Math.floor(Math.random() * 6 + 1) - game.character.vlugheid;
                        game.character.currentHitpoints -= Math.max(0, damage);
                        game.logToActionLog('Aah! Je valt plotseling in een diepe kuil en bezeert je. Je krijgt ' + damage + ' schade door het vallen!');
                        game.logToLocationLog('Er is hier een diepe valkuil.');
                    }
                ],
                actions: [
                    {
                        text: 'Klim uit de kuil',
                        type: 'skill',
                        execute: function (game) {
                            // Todo: skill check
                            //if (false) {
                            //    game.logToActionLog('Het lukt je niet uit de kuil te klimmen.');
                            //    return;
                            //}
                            game.logToActionLog('Je klimt uit de kuil.');
                            game.currentLocation.destinations.push({
                                text: 'Dieper de grot in',
                                target: Locations.DoorOne
                            }, {
                                text: 'Richting ingang',
                                target: Locations.Entry
                            });
                            // Todo: does this work?
                            var action = game.currentLocation.actions.first(function (x) { return x.text === 'Klim uit de kuil'; });
                            game.currentLocation.actions.remove(action);
                            delete game.currentLocation.actions['klimmen'];
                        }
                    },
                    StoryScript.Actions.Search({
                        text: 'Doorzoek de kuil',
                        difficulty: 9,
                        success: function (game) {
                            game.currentLocation.items.push(StoryScript.Items.LeatherHelmet());
                            game.logToLocationLog('In de kuil voel je botten, spinrag en de resten van kleding. Ook vind je er een nog bruikbare helm!');
                        },
                        fail: function (game) {
                            game.logToLocationLog('In de kuil voel je botten, spinrag en de resten van kleding.');
                        }
                    })
                ]
            };
        }
        Locations.LeftCorridor = LeftCorridor;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function LeftRoom() {
            return {
                name: 'De slaapkamer van de orks',
                enemies: [
                    StoryScript.Enemies.Orc,
                    StoryScript.Enemies.Goblin
                ],
                destinations: [
                    {
                        text: 'De kamer van de ork',
                        target: Locations.RoomOne
                    }
                ]
            };
        }
        Locations.LeftRoom = LeftRoom;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function RightCorridor() {
            return {
                name: 'Een gemetselde gang',
                destinations: [
                    {
                        text: 'Naar het kruispunt (noord)',
                        target: Locations.CrossRoads
                    },
                    {
                        text: 'Door de houten deur (zuid)',
                        target: Locations.RoomOne
                    }
                ]
            };
        }
        Locations.RightCorridor = RightCorridor;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function RightRoom() {
            return {
                name: 'Een schemerige gang',
                enemies: [
                    StoryScript.Enemies.GiantBat
                ],
                destinations: [
                    {
                        text: 'Richting het licht',
                        target: Locations.CandleLitCave
                    },
                    {
                        text: 'Richting ingang',
                        target: Locations.Entry
                    }
                ],
                actions: [
                    StoryScript.Actions.Search({
                        difficulty: 8,
                        success: function (game) {
                            game.logToLocationLog('Je ruikt de geur van brandende kaarsen.');
                        },
                        fail: function (game) {
                            game.logToLocationLog('Er zijn hier heel veel vleermuizen. En heel veel vleermuispoep.');
                        }
                    })
                ]
            };
        }
        Locations.RightRoom = RightRoom;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function RoomOne() {
            return {
                name: 'De kamer van de ork',
                enemies: [
                    StoryScript.Enemies.Orc
                ],
                items: [
                    StoryScript.Items.BlackKey
                ],
                destinations: [
                    {
                        text: 'Noord',
                        target: Locations.RightCorridor,
                        barrier: {
                            text: 'Houten deur',
                            actions: [
                                {
                                    text: 'Open de deur',
                                    action: StoryScript.Actions.Inspect('Een eikenhouten deur met een ijzeren hendel. De deur is niet op slot.')
                                },
                                {
                                    text: 'Open de deur',
                                    action: StoryScript.Actions.Open(function (game, destination) {
                                        game.logToLocationLog('Je opent de eikenhouten deur.');
                                        destination.text = 'Gang (noord)';
                                    })
                                }
                            ]
                        }
                    },
                    {
                        text: 'Tweede deur (west)',
                        target: Locations.CentreRoom,
                    },
                    {
                        text: 'Derde deur (zuid)',
                        target: Locations.LeftRoom
                    },
                    {
                        text: 'Deuropening (oost); richting ingang',
                        target: Locations.LeftCorridor
                    }
                ]
            };
        }
        Locations.RoomOne = RoomOne;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function Start() {
            return {
                name: 'De ingang van de Gevaarlijke Grot',
                destinations: [
                    {
                        text: 'Ga de grot in',
                        target: Locations.Entry,
                    }
                ],
                actions: [
                    StoryScript.Actions.Search({
                        difficulty: 10,
                        success: function (game) {
                            game.logToLocationLog('Aan de achterkant van het waarschuwingsbord staan enkele runen in de taal van de orken en trollen. Je kan deze taal helaas niet lezen. Het lijkt erop dat er bloed gebruikt is als inkt.');
                        },
                        fail: function (game) {
                            game.logToLocationLog('Je ziet gras, bomen en struiken. Alle plantengroei stopt een paar centimeter buiten de grot. Binnen is het donker.');
                        }
                    })
                ]
            };
        }
        Locations.Start = Start;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function Temp() {
            return {
                name: 'Deze locatie bestaat nog niet',
                destinations: [
                    {
                        text: 'Ga terug naar de ingang',
                        target: Locations.Entry,
                    }
                ]
            };
        }
        Locations.Temp = Temp;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));
var StoryScript;
(function (StoryScript) {
    var Locations;
    (function (Locations) {
        function WestCrossing() {
            return {
                name: 'Een donkere gemetselde gang',
                enemies: [
                    StoryScript.Enemies.Goblin
                ],
                destinations: [
                    {
                        text: 'Richting kruispunt (oost)',
                        target: Locations.CrossRoads
                    },
                    {
                        text: 'Deur (west)',
                        target: Locations.Arena,
                        barrier: {
                            text: 'Metalen deur',
                            key: StoryScript.Items.BlackKey,
                            actions: [
                                {
                                    text: 'Onderzoek de deur',
                                    action: StoryScript.Actions.Inspect('Een deur van een dof grijs metaal, met een rode deurknop. Op de deur staat een grote afbeelding: een rood zwaard. Zodra je het handvat aanraakt, gloeit het zwaard op met een rood licht. De deur is niet op slot.')
                                },
                                {
                                    text: 'Open de deur',
                                    action: StoryScript.Actions.Open(function (game, destination) {
                                        game.logToLocationLog('Je opent de deur.');
                                        destination.text = 'Donkere kamer';
                                    })
                                }
                            ]
                        }
                    }
                ]
            };
        }
        Locations.WestCrossing = WestCrossing;
    })(Locations = StoryScript.Locations || (StoryScript.Locations = {}));
})(StoryScript || (StoryScript = {}));

//# sourceMappingURL=../maps/game.js.map
