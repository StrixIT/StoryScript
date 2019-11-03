(function(window) {
'use strict';

var StoryScript;
(function (StoryScript) {
    class DataKeys {
    }
    DataKeys.HIGHSCORES = 'highScores';
    DataKeys.CHARACTER = 'character';
    DataKeys.STATISTICS = 'statistics';
    DataKeys.LOCATION = 'location';
    DataKeys.PREVIOUSLOCATION = 'previousLocation';
    DataKeys.WORLD = 'world';
    DataKeys.WORLDPROPERTIES = 'worldProperties';
    DataKeys.GAME = 'game';
    StoryScript.DataKeys = DataKeys;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    var _definitions = null;
    var _registeredIds = new Set();
    var _currentEntityId = null;
    function DynamicEntity(entityFunction, name) {
        var namedFunction = StoryScript.createNamedFunction(null, entityFunction, getIdFromName({ id: '', name: name }));
        return CreateEntityProxy(namedFunction)();
    }
    StoryScript.DynamicEntity = DynamicEntity;
    function CreateEntityProxy(entityFunction) {
        return entityFunction.proxy((originalScope, originalFunc, ...params) => {
            var id = params.splice(params.length - 1, 1)[0];
            var oldId = GetCurrentEntityId();
            SetCurrentEntityId(id);
            var result = originalFunc.apply(originalScope, params);
            SetCurrentEntityId(oldId);
            return result;
        }, entityFunction.name || entityFunction.originalFunctionName);
    }
    StoryScript.CreateEntityProxy = CreateEntityProxy;
    function GetCurrentEntityId() {
        return _currentEntityId;
    }
    StoryScript.GetCurrentEntityId = GetCurrentEntityId;
    function SetCurrentEntityId(id) {
        _currentEntityId = id ? id.toLowerCase() : id;
    }
    StoryScript.SetCurrentEntityId = SetCurrentEntityId;
    function Location(entity) {
        return Create('location', entity);
    }
    StoryScript.Location = Location;
    function Enemy(entity) {
        return Create('enemy', entity);
    }
    StoryScript.Enemy = Enemy;
    function Person(entity) {
        return Create('person', entity);
    }
    StoryScript.Person = Person;
    function Item(entity) {
        return Create('item', entity);
    }
    StoryScript.Item = Item;
    function Key(entity) {
        return Create('item', entity);
    }
    StoryScript.Key = Key;
    function Feature(entity) {
        return Create('feature', entity);
    }
    StoryScript.Feature = Feature;
    function Quest(entity) {
        return Create('quest', entity);
    }
    StoryScript.Quest = Quest;
    function Action(action) {
        return Create('action', action);
    }
    StoryScript.Action = Action;
    function setReadOnlyProperties(key, data) {
        if (key.startsWith(StoryScript.DataKeys.GAME + '_')) {
            data.world.forEach(location => {
                setReadOnlyLocationProperties(location);
            });
            setReadOnlyCharacterProperties(data.character);
        }
        else if (key === StoryScript.DataKeys.WORLD) {
            data.forEach(location => {
                setReadOnlyLocationProperties(location);
            });
        }
        else if (key === StoryScript.DataKeys.CHARACTER) {
            setReadOnlyCharacterProperties(data);
        }
    }
    StoryScript.setReadOnlyProperties = setReadOnlyProperties;
    function initCollection(entity, property, buildInline) {
        const _entityCollections = [
            'features',
            'items',
            'enemies',
            'persons',
            'quests'
        ];
        const _gameCollections = _entityCollections.concat([
            'actions',
            'combatActions',
            'destinations',
            'enterEvents',
            'leaveEvents',
            'combine'
        ]);
        if (_gameCollections.indexOf(property) === -1) {
            return;
        }
        var collection = entity[property] || [];
        if (entity[property] && buildInline) {
            // Initialize any objects that have been declared inline (not a recommended but possible way to declare objects). Check
            // for the existence of an id property to determine whether the object is already initialized.
            var inlineCollection = entity[property].map((e) => e.id ? e : Create(StoryScript.getSingular(property), e, getIdFromName(e)));
            collection.length = 0;
            inlineCollection.forEach(e => collection.push(e));
        }
        Object.defineProperty(entity, property, {
            enumerable: true,
            get: function () {
                return collection;
            },
            set: function () {
                var type = entity.type ? entity.type : null;
                var messageStart = 'Cannot set collection ' + property;
                var message = type ? messageStart + ' on type ' + type : messageStart + '.';
                throw new Error(message);
            }
        });
        if (_entityCollections.indexOf(property) === -1) {
            return;
        }
        var readOnlyCollection = entity[property];
        Object.defineProperty(readOnlyCollection, 'push', {
            writable: true,
            value: readOnlyCollection.push.proxy(pushEntity)
        });
    }
    StoryScript.initCollection = initCollection;
    function Create(type, entity, id) {
        switch (type) {
            case 'location':
                {
                    return createLocation(entity);
                }
                break;
            case 'enemy':
                {
                    return EnemyBase(entity, 'enemy', id);
                }
                break;
            case 'person':
                {
                    return createPerson(entity, id);
                }
                break;
            case 'item':
                {
                    return createItem(entity, id);
                }
                break;
            case 'feature':
                {
                    return createFeature(entity, id);
                }
                break;
            case 'quest':
                {
                    return CreateObject(entity, 'quest', id);
                }
                break;
            case 'action': {
                return CreateObject(entity, 'action', id);
            }
        }
    }
    function createLocation(entity) {
        var location = CreateObject(entity, 'location');
        if (location.destinations) {
            location.destinations.forEach(d => {
                if (d.barrier && d.barrier.key && typeof (d.barrier.key) === 'function') {
                    d.barrier.key = d.barrier.key.name || d.barrier.key.originalFunctionName;
                }
            });
        }
        if (!location.destinations) {
            console.log('No destinations specified for location ' + location.name);
        }
        initCollection(location, 'actions');
        initCollection(location, 'combatActions');
        initCollection(location, 'destinations');
        initCollection(location, 'features', true);
        initCollection(location, 'items');
        initCollection(location, 'enemies');
        initCollection(location, 'persons');
        setReadOnlyLocationProperties(location);
        return location;
    }
    function createPerson(entity, id) {
        var person = EnemyBase(entity, 'person', id);
        initCollection(person, 'quests');
        return person;
    }
    function createItem(entity, id) {
        var item = CreateObject(entity, 'item', id);
        compileCombinations(item);
        return item;
    }
    function createFeature(entity, id) {
        var feature = CreateObject(entity, 'feature', id);
        compileCombinations(feature);
        return feature;
    }
    function EnemyBase(entity, type, id) {
        var enemy = CreateObject(entity, type, id);
        compileCombinations(enemy);
        initCollection(enemy, 'items');
        return enemy;
    }
    function CreateObject(entity, type, id) {
        var checkType = entity;
        if (checkType.id || checkType.type) {
            var propertyErrors = checkType.id && checkType.type ? ['id', 'type']
                : checkType.id ? ['id'] : ['type'];
            var message = propertyErrors.length > 1 ? 'Properties {0} are used by StoryScript. Don\'t use them on your own types.'
                : 'Property {0} is used by StoryScript. Don\'t use it on your own types.';
            throw new Error(message.replace('{0}', propertyErrors.join(' and ')));
        }
        var compiledEntity = typeof entity === 'function' ? entity() : entity;
        var definitions = getDefinitions();
        compiledEntity.id = id ? id : GetCurrentEntityId();
        var definitionKeys = StoryScript.getDefinitionKeys(definitions);
        addFunctionIds(compiledEntity, type, definitionKeys);
        var plural = StoryScript.getPlural(type);
        // Add the type to the object so we can distinguish between them in the combine functionality.
        compiledEntity.type = type;
        if (_registeredIds.has(compiledEntity.id + '|' + compiledEntity.type + '|' + !id)) {
            throw new Error('Duplicate id detected: ' + compiledEntity.id + '. You cannot use names for entities declared inline that are the same as the names of stand-alone entities.');
        }
        _registeredIds.add(compiledEntity.id + '|' + compiledEntity.type);
        var functions = window.StoryScript.ObjectFactory.GetFunctions();
        // If this is the first time an object of this definition is created, get the functions.
        if (!functions[plural] || !Object.getOwnPropertyNames(functions[plural]).find(e => e.startsWith(compiledEntity.id + '|'))) {
            getFunctions(plural, functions, definitionKeys, compiledEntity, null);
        }
        return compiledEntity;
    }
    function setReadOnlyLocationProperties(location) {
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
    function setReadOnlyCharacterProperties(character) {
        Object.defineProperty(character, 'combatItems', {
            get: function () {
                return character.items.filter(e => { return e.useInCombat; });
            }
        });
    }
    function getDefinitions() {
        _definitions = _definitions || window.StoryScript.ObjectFactory.GetDefinitions();
        return _definitions;
    }
    function addFunctionIds(entity, type, definitionKeys, path) {
        if (!path) {
            path = entity.id || entity.name;
        }
        for (var key in entity) {
            if (!entity.hasOwnProperty(key)) {
                continue;
            }
            if (definitionKeys.indexOf(key) != -1 || key === 'target') {
                continue;
            }
            var value = entity[key];
            if (value == undefined) {
                return;
            }
            else if (typeof value === 'object') {
                addFunctionIds(entity[key], type, definitionKeys, getPath(value, key, path, definitionKeys));
            }
            else if (typeof value === 'function' && !value.isProxy) {
                var functionId = path ? path + '|' + key : key;
                value.functionId = 'function#' + type + '|' + functionId + '#' + StoryScript.createFunctionHash(value);
            }
        }
    }
    function getPath(value, key, path, definitionKeys) {
        if (definitionKeys.indexOf(key) != -1) {
            path = key;
        }
        else if (definitionKeys.indexOf(path) != -1 && !isNaN(parseInt(key))) {
        }
        else {
            path = path === undefined ? key : path + '|' + key;
        }
        if (value.id) {
            path = path + '|' + value.id;
        }
        return path;
    }
    function compileCombinations(entry) {
        if (entry.combinations) {
            var combines = [];
            var failText = entry.combinations.failText;
            entry.combinations.combine.forEach((combine) => {
                var compiled = combine;
                compiled.tool = compiled.tool && (compiled.tool.name || compiled.tool.originalFunctionName);
                combines.push(compiled);
            });
            entry.combinations.combine = combines;
            entry.combinations.failText = failText;
            initCollection(entry.combinations, 'combine');
        }
    }
    function pushEntity(originalScope, originalFunction, entity) {
        entity = typeof entity === 'function' ? entity() : entity;
        if (!entity.id && entity.name) {
            entity.id = getIdFromName(entity);
        }
        originalFunction.apply(originalScope, [entity]);
    }
    ;
    function getIdFromName(entity) {
        var id = entity.name.toLowerCase().replace(/\s/g, '');
        return id;
    }
    function getFunctions(type, functionList, definitionKeys, entity, parentId) {
        if (!parentId) {
            parentId = entity.id || entity.name;
        }
        for (var key in entity) {
            if (!entity.hasOwnProperty(key)) {
                continue;
            }
            if (definitionKeys.indexOf(key) != -1 || key === 'target') {
                continue;
            }
            var value = entity[key];
            if (value == undefined) {
                continue;
            }
            else if (typeof value === 'object') {
                getFunctions(type, functionList, definitionKeys, entity[key], entity[key].id ? parentId + '|' + key + '|' + entity[key].id : parentId + '|' + key);
            }
            else if (typeof value == 'function' && !value.isProxy) {
                var functionId = parentId + '|' + key;
                if (!functionList[type]) {
                    functionList[type] = {};
                }
                if (functionList[type][functionId]) {
                    throw new Error('Trying to register a duplicate function key: ' + functionId);
                }
                functionList[type][functionId] = {
                    function: value,
                    hash: StoryScript.createFunctionHash(value)
                };
            }
        }
    }
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class ObjectFactory {
        constructor(nameSpace, rules, texts) {
            this._game = {};
            this._definitions = {};
            this._localStorageService = new StoryScript.LocalStorageService();
            this.GetNameSpace = () => this._nameSpace;
            this.GetDefinitions = () => this._definitions;
            this.GetFunctions = () => this._functions;
            this.GetGame = () => {
                this.init();
                return this._game;
            };
            this.GetTexts = () => {
                this.init();
                return this._texts;
            };
            this.GetGameService = () => {
                this.init();
                return this._gameService;
            };
            this.GetTradeService = () => {
                this.init();
                return this._tradeService;
            };
            this.GetConversationService = () => {
                this.init();
                return this._conversationService;
            };
            this.GetCharacterService = () => {
                this.init();
                return this._characterService;
            };
            this.GetCombinationService = () => {
                this.init();
                return this._combinationService;
            };
            this.init = () => {
                if (!ObjectFactory._isInitialized) {
                    this.getDefinitions();
                    this.registerFunctions();
                    this._game.definitions = this._definitions;
                    this._helperService = new StoryScript.HelperService(this._game);
                    this._tradeService = new StoryScript.TradeService(this._game, this._texts);
                    this._dataService = new StoryScript.DataService(this._localStorageService, this._nameSpace);
                    this._conversationService = new StoryScript.ConversationService(this._dataService, this._game);
                    this._locationService = new StoryScript.LocationService(this._dataService, this._rules, this._game, this._definitions);
                    this._combinationService = new StoryScript.CombinationService(this._dataService, this._locationService, this._game, this._rules, this._texts);
                    this._characterService = new StoryScript.CharacterService(this._game, this._rules);
                    this._gameService = new StoryScript.GameService(this._dataService, this._locationService, this._characterService, this._combinationService, this._rules, this._helperService, this._game, this._texts);
                    ObjectFactory._isInitialized = true;
                }
            };
            this.registerFunctions = () => {
                var definitionKeys = StoryScript.getDefinitionKeys(this._definitions);
                this._functions = {};
                var index = 0;
                for (var i in this._definitions) {
                    var type = definitionKeys[index] || 'actions';
                    var definitions = this._definitions[i];
                    this._functions[type] = {};
                    for (var j in definitions) {
                        var definition = definitions[j];
                        definition();
                    }
                    index++;
                }
            };
            this.getDefinitions = () => {
                var nameSpaceObject = window[this._nameSpace];
                this._definitions.locations = this.moveObjectPropertiesToArray(nameSpaceObject['Locations']);
                this._definitions.features = this.moveObjectPropertiesToArray(nameSpaceObject['Features']);
                this._definitions.enemies = this.moveObjectPropertiesToArray(nameSpaceObject['Enemies']);
                this._definitions.persons = this.moveObjectPropertiesToArray(nameSpaceObject['Persons']);
                this._definitions.items = this.moveObjectPropertiesToArray(nameSpaceObject['Items']);
                this._definitions.quests = this.moveObjectPropertiesToArray(nameSpaceObject['Quests']);
                this._definitions.actions = this.moveObjectPropertiesToArray(window['StoryScript']['Actions']);
                this.moveObjectPropertiesToArray(nameSpaceObject['Actions'], this._definitions.actions);
            };
            this._nameSpace = nameSpace;
            this._texts = texts;
            this._rules = rules;
        }
        moveObjectPropertiesToArray(object, collection) {
            collection = collection || [];
            for (var n in object) {
                if (object.hasOwnProperty(n)) {
                    object[n] = StoryScript.CreateEntityProxy(object[n]);
                    collection.push(object[n]);
                }
            }
            return collection;
        }
    }
    ObjectFactory._isInitialized = false;
    StoryScript.ObjectFactory = ObjectFactory;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class DefaultTexts {
        constructor() {
            this.texts = {
                equipmentHeader: 'Equipment',
                head: 'Head',
                amulet: 'Amulet',
                rightHand: 'Right hand',
                leftHand: 'Left hand',
                body: 'Body',
                legs: 'Legs',
                feet: 'Feet',
                backpack: 'Backpack',
                equip: 'Equip',
                use: 'Use',
                drop: 'Drop',
                enemies: 'Enemies',
                attack: 'Attack {0}!',
                newGame: 'New game',
                nextQuestion: 'Next question',
                startAdventure: 'Start adventure',
                actions: 'Actions',
                destinations: 'Destinations',
                back: 'Back: ',
                onTheGround: 'On the ground',
                youLost: 'You lost...',
                questFailed: 'You have failed your quest!',
                finalScore: 'Your score: ',
                tryAgain: 'Try again',
                highScores: 'High Scores',
                youWon: 'You won!',
                congratulations: 'Congratulations! You have won the game!',
                playAgain: 'Play again',
                startOver: 'Start over',
                resetWorld: 'Reset world',
                gameName: 'Game template',
                save: 'Save',
                saveGame: 'Save game',
                load: 'Load',
                loadGame: 'Load game',
                loading: 'Loading...',
                youAreHere: 'You are at {0}',
                messages: 'Messages',
                hitpoints: 'Health',
                currency: 'Money',
                trade: 'Trade with {0}',
                talk: 'Talk to {0}',
                encounters: 'Encounters',
                closeModal: 'Close',
                combatTitle: 'Combat',
                value: 'value',
                traderCurrency: 'Trader money: {0} {1}',
                startCombat: 'Start combat',
                combatWin: 'You are victorious!',
                enemiesToFight: 'You face these foes: ',
                useInCombat: 'Use {0}',
                view: 'View',
                quests: 'Quests',
                currentQuests: 'Current',
                completedQuests: 'Completed',
                hands: 'Hands',
                leftRing: 'Left ring',
                rightRing: 'Right ring',
                yourName: 'Name',
                combinations: 'Combinations',
                tryCombination: 'Try',
                noCombination: 'You {2} the {0} {3} the {1}. Nothing happens.',
                noCombinationNoTool: 'You {1} {2} the {0}. Nothing happens.',
                levelUp: 'Level up',
                completeLevelUp: 'Accept',
                levelUpDescription: 'You reached level {0}.',
                newSaveGame: 'New save game',
                existingSaveGames: 'Saved games',
                overwriteSaveGame: 'Overwrite saved game {0}?',
                loadSaveGame: 'Load saved game {0}?',
                characterSheet: 'Character sheet',
                skipIntro: 'Skip intro',
                mainMenu: 'Main menu',
                mainMenuShort: 'Menu',
                confirmRestart: 'Really restart?',
                restartCancelled: 'No',
                restartConfirmed: 'Yes',
                cancel: 'Cancel'
            };
            this.format = (template, tokens) => {
                if (template && tokens) {
                    for (var i = 0; i < tokens.length; i++) {
                        var pattern = '[ ]{0,1}\\{' + i + '\\}[ ]{0,1}';
                        var match = new RegExp(pattern).exec(template);
                        if (match) {
                            var matchReplacement = match[0].replace('{' + i + '}', '');
                            if (tokens[i].trim && tokens[i].trim().length == 0 && matchReplacement.length > 1) {
                                template = template.replace(match[0], ' ');
                            }
                            else {
                                template = template.replace('{' + i + '}', tokens[i]);
                            }
                        }
                    }
                }
                return template;
            };
            this.titleCase = (text) => text.substring(0, 1).toUpperCase() + text.substring(1);
        }
    }
    StoryScript.DefaultTexts = DefaultTexts;
})(StoryScript || (StoryScript = {}));



var StoryScript;
(function (StoryScript) {
    if (Function.prototype.proxy === undefined) {
        // This code has to be outside of the addFunctionExtensions to have the correct function scope for the proxy.
        Function.prototype.proxy = function (proxyFunction, ...params) {
            var originalFunction = this;
            return (function () {
                var name = originalFunction.name;
                var func = createNamedFunction(originalFunction, proxyFunction, name, params);
                func.isProxy = true;
                return func;
            })();
        };
    }
    function createNamedFunction(originalFunction, proxyFunction, name, ...params) {
        var namedFunction = { [name]: function () {
                var args = [].slice.call(arguments);
                if (originalFunction) {
                    args.splice(0, 0, this);
                    args.splice(1, 0, originalFunction);
                }
                return proxyFunction.apply(this, args.concat(...params));
            } }[name];
        // Making the proxy a named function as done above doesn't work in Edge. Use an additional property as a workaround.
        namedFunction.originalFunctionName = name;
        return namedFunction;
    }
    StoryScript.createNamedFunction = createNamedFunction;
    function addFunctionExtensions() {
        if (Function.prototype.name === undefined) {
            Object.defineProperty(Function.prototype, 'name', {
                get: function () {
                    return /function ([^(]*)/.exec(this + '')[1];
                }
            });
        }
        // This allows deserializing functions added at runtime without using eval.
        // Found at https://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
        if (typeof String.prototype.parseFunction !== 'function') {
            (String.prototype).parseFunction = function () {
                var text = this.toString();
                var funcReg = /function[\s]*([a-zA-Z0-9]*)(\([\s\w\d,]*\))[\s]*({[\S\s]*})/gmi;
                var match = funcReg.exec(text);
                if (match) {
                    var args = match[2].substring(1, match[2].length - 1);
                    return new Function(args, match[3]);
                }
                return null;
            };
        }
    }
    StoryScript.addFunctionExtensions = addFunctionExtensions;
    function addArrayExtensions() {
        if (Array.prototype.get === undefined) {
            Object.defineProperty(Array.prototype, 'get', {
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
        }
        if (Array.prototype.all === undefined) {
            Object.defineProperty(Array.prototype, 'all', {
                enumerable: false,
                value: function (id) {
                    return find(id, this);
                }
            });
        }
        if (Array.prototype.remove === undefined) {
            Object.defineProperty(Array.prototype, 'remove', {
                enumerable: false,
                writable: true,
                value: function (item) {
                    if (!item) {
                        return;
                    }
                    var entry = find(item, this)[0];
                    if (!entry) {
                        return;
                    }
                    var index = Array.prototype.indexOf.call(this, entry);
                    if (index != -1) {
                        Array.prototype.splice.call(this, index, 1);
                    }
                }
            });
        }
    }
    StoryScript.addArrayExtensions = addArrayExtensions;
    function createFunctionHash(func) {
        var hash = 0;
        var functionString = func.toString();
        if (functionString.length == 0) {
            return hash;
        }
        for (var i = 0; i < functionString.length; i++) {
            var char = functionString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    StoryScript.createFunctionHash = createFunctionHash;
    function compareString(left, right) {
        if ((left === undefined && right === undefined) || (left === null && right === null)) {
            return true;
        }
        else if ((left === null || left === undefined) || (right === null || right === undefined)) {
            return false;
        }
        return left.toLowerCase() === right.toLowerCase();
    }
    StoryScript.compareString = compareString;
    function find(id, array) {
        if (typeof id === 'object') {
            return Array.prototype.filter.call(array, (x) => x === id);
        }
        id = typeof id === 'function' ? id.name || id.originalFunctionName : id;
        return Array.prototype.filter.call(array, (x) => {
            var target = typeof x.target === 'function' ? x.target.name || x.target.originalFunctionName : x.target;
            return compareString(x.id, id) || compareString(target, id);
        });
    }
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    /**
     * This function bootstraps and runs your game.
     * @param nameSpace Your game's namespace (e.g. '_GameTemplate')
     * @param texts Your game's custom interface texts
     * @param rules Your game rules
     */
    function Run(nameSpace, texts, rules) {
        StoryScript.addFunctionExtensions();
        StoryScript.addArrayExtensions();
        window.StoryScript.ObjectFactory = new StoryScript.ObjectFactory(nameSpace, rules, texts);
    }
    StoryScript.Run = Run;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    function getPlural(name) {
        return name.endsWith('y') ?
            name.substring(0, name.length - 1) + 'ies'
            : name.endsWith('s') ?
                name
                : name + 's';
    }
    StoryScript.getPlural = getPlural;
    function getSingular(name) {
        return name.endsWith('ies') ?
            name.substring(0, name.length - 3) + 'y'
            : name.substring(0, name.length - 1);
    }
    StoryScript.getSingular = getSingular;
    function addHtmlSpaces(text) {
        if (!text) {
            return null;
        }
        if (text.substr(0, 1).trim() !== '' && text.substr(0, 6) !== '&nbsp;') {
            text = '&nbsp;' + text;
        }
        if (text.substr(text.length - 1, 1).trim() !== '' && text.substr(text.length - 6, 6) !== '&nbsp;') {
            text = text + '&nbsp;';
        }
        return text;
    }
    StoryScript.addHtmlSpaces = addHtmlSpaces;
    function isEmpty(object, property) {
        var objectToCheck = property ? object[property] : object;
        return objectToCheck ? Array.isArray(objectToCheck) ? objectToCheck.length === 0 : Object.keys(objectToCheck).length === 0 : true;
    }
    StoryScript.isEmpty = isEmpty;
    function getDefinitionKeys(definitions) {
        var definitionKeys = [];
        for (var i in definitions) {
            if (i !== 'actions') {
                definitionKeys.push(i);
            }
        }
        return definitionKeys;
    }
    StoryScript.getDefinitionKeys = getDefinitionKeys;
    function random(type, definitions, selector) {
        var collection = definitions[type];
        if (!collection) {
            return null;
        }
        var selection = getFilteredInstantiatedCollection(collection, type, definitions, selector);
        if (selection.length == 0) {
            return null;
        }
        var index = Math.floor(Math.random() * selection.length);
        return selection[index];
    }
    StoryScript.random = random;
    function randomList(collection, count, type, definitions, selector) {
        var selection = getFilteredInstantiatedCollection(collection, type, definitions, selector);
        var results = [];
        if (count === undefined) {
            count = selection.length;
        }
        if (selection.length > 0) {
            while (results.length < count && results.length < selection.length) {
                var index = Math.floor(Math.random() * selection.length);
                if (results.indexOf(selection[index]) == -1) {
                    results.push(selection[index]);
                }
            }
        }
        return results;
    }
    StoryScript.randomList = randomList;
    function custom(definition, customData) {
        var instance = definition();
        return extend(instance, customData);
    }
    StoryScript.custom = custom;
    function equals(entity, definition) {
        return entity.id ? entity.id === (definition.name || definition.originalFunctionName) : false;
    }
    StoryScript.equals = equals;
    function getFilteredInstantiatedCollection(collection, type, definitions, selector) {
        var collectionToFilter = [];
        if (typeof collection[0] === 'function') {
            collection.forEach((def) => {
                collectionToFilter.push(def());
            });
        }
        else {
            collectionToFilter = collection;
        }
        return selector ? collectionToFilter.filter(selector) : collectionToFilter;
    }
    function extend(target, source) {
        if (!source.length) {
            source = [source];
        }
        for (var i = 0, ii = source.length; i < ii; ++i) {
            var obj = source[i];
            if (!(obj !== null && typeof obj === 'object') && typeof obj !== 'function') {
                continue;
            }
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];
                target[key] = src;
            }
        }
        return target;
    }
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    var Actions;
    (function (Actions) {
        /**
         * A basic function to remove a barrier and then execute a callback function.
         * @param callback
         */
        function Open(callback) {
            return (game, barrier, destination) => {
                delete destination.barrier;
                if (callback) {
                    callback(game, barrier, destination);
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
        /**
         * A basic function to remove a barrier using a key and then execute a callback function. When it is not specified that the player
         * should keep the key after using it, it is removed from his item list.
         * @param callBack
         */
        function OpenWithKey(callBack) {
            return (game, barrier, destination) => {
                var key = typeof barrier.key === 'function' ? barrier.key() : game.helpers.getItem(barrier.key);
                if (key.keepAfterUse === undefined || key.keepAfterUse !== true) {
                    game.character.items.remove(barrier.key);
                    game.currentLocation.items.remove(barrier.key);
                }
                delete destination.barrier;
                if (callBack) {
                    callBack(game, barrier, destination);
                }
            };
        }
        Actions.OpenWithKey = OpenWithKey;
    })(Actions = StoryScript.Actions || (StoryScript.Actions = {}));
})(StoryScript || (StoryScript = {}));































var StoryScript;
(function (StoryScript) {
    /**
     * An entry in the high score log.
     */
    class ScoreEntry {
    }
    StoryScript.ScoreEntry = ScoreEntry;
})(StoryScript || (StoryScript = {}));





















var StoryScript;
(function (StoryScript) {
    /**
     * Used to set the availability of actions to the player.
     */
    let ActionStatus;
    (function (ActionStatus) {
        /**
         * The action shows up for the player and is selectable.
         */
        ActionStatus[ActionStatus["Available"] = 0] = "Available";
        /**
        * The action shows up for the player but is not selectable. Useful to show actions that could be performed if additional criteria
        * would have been met (e.g. the character needs to be stronger to break down a door).
        */
        ActionStatus[ActionStatus["Disabled"] = 1] = "Disabled";
        /**
        * The action is not shown to the player. Useful for actions that are only conditionally available.
        */
        ActionStatus[ActionStatus["Unavailable"] = 2] = "Unavailable";
    })(ActionStatus = StoryScript.ActionStatus || (StoryScript.ActionStatus = {}));
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    /**
     * Used to differentiate between actions visually (e.g. color).
     */
    let ActionType;
    (function (ActionType) {
        ActionType[ActionType["Regular"] = 0] = "Regular";
        ActionType[ActionType["Check"] = 1] = "Check";
        ActionType[ActionType["Combat"] = 2] = "Combat";
        ActionType[ActionType["Trade"] = 3] = "Trade";
    })(ActionType = StoryScript.ActionType || (StoryScript.ActionType = {}));
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    /**
     * Used to specify what part of the player body the item is meant for, if any. You can specify the equipment slots used in your game as an object
     * on the character class of your game. Note that items may belong to more than one type, e.g. two-handed weapons that require both the left and
     * right hand to use.
     */
    let EquipmentType;
    (function (EquipmentType) {
        /**
         * Items worn on the head, ranging from diadem to helmets covering the entire head.
         */
        EquipmentType[EquipmentType["Head"] = 0] = "Head";
        /**
         * Items worn around the neck, like amulets.
         */
        EquipmentType[EquipmentType["Amulet"] = 1] = "Amulet";
        /**
         * Items worn on the torso and upper arms.
         */
        EquipmentType[EquipmentType["Body"] = 2] = "Body";
        /**
         * Items worn on the hands, like gloves.
         */
        EquipmentType[EquipmentType["Hands"] = 3] = "Hands";
        /**
         * Items that can be used in the non-dominant hand.
         */
        EquipmentType[EquipmentType["LeftHand"] = 4] = "LeftHand";
        /**
         * Small items worn around the finger on the non-dominant hand.
         */
        EquipmentType[EquipmentType["LeftRing"] = 5] = "LeftRing";
        /**
         * Items that can be used in the dominant hand.
         */
        EquipmentType[EquipmentType["RightHand"] = 6] = "RightHand";
        /**
         * Small items worn around the finger on the dominant hand.
         */
        EquipmentType[EquipmentType["RightRing"] = 7] = "RightRing";
        /**
         * Items worn on the legs.
         */
        EquipmentType[EquipmentType["Legs"] = 8] = "Legs";
        /**
         * Items like boots that are used for walking but may also offer additional protection.
         */
        EquipmentType[EquipmentType["Feet"] = 9] = "Feet";
        /**
         * All other type of items. Miscellaneous items cannot be equipped.
         */
        EquipmentType[EquipmentType["Miscellaneous"] = 10] = "Miscellaneous";
    })(EquipmentType = StoryScript.EquipmentType || (StoryScript.EquipmentType = {}));
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    /**
     * Used to determine the UI to show to the player, e.g. the exploration or trade screens.
     */
    let GameState;
    (function (GameState) {
        GameState["Intro"] = "Intro";
        GameState["CreateCharacter"] = "CreateCharacter";
        GameState["Play"] = "Play";
        GameState["LevelUp"] = "LevelUp";
        GameState["GameOver"] = "GameOver";
        GameState["Victory"] = "Victory";
    })(GameState = StoryScript.GameState || (StoryScript.GameState = {}));
    let PlayState;
    (function (PlayState) {
        PlayState["Menu"] = "Menu";
        PlayState["Combat"] = "Combat";
        PlayState["Trade"] = "Trade";
        PlayState["Conversation"] = "Conversation";
        PlayState["Description"] = "Description";
    })(PlayState = StoryScript.PlayState || (StoryScript.PlayState = {}));
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class CombinationService {
        constructor(_dataService, _locationService, _game, _rules, _texts) {
            this._dataService = _dataService;
            this._locationService = _locationService;
            this._game = _game;
            this._rules = _rules;
            this._texts = _texts;
            this.getCombinationActions = () => this._rules.setup.getCombinationActions ? this._rules.setup.getCombinationActions() : [];
            this.getCombineClass = (tool) => {
                let className = '';
                if (tool) {
                    className = this._game.combinations.activeCombination ? this._game.combinations.activeCombination.selectedTool && this._game.combinations.activeCombination.selectedTool.id === tool.id ? 'combine-active-selected' : 'combine-selectable' : '';
                }
                else {
                    className = this._game.combinations.activeCombination ? 'combine-active-hide' : '';
                }
                return className;
            };
            this.setActiveCombination = (combination) => {
                this._game.combinations.combinationResult.reset();
                if (!combination) {
                    return;
                }
                if (this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === combination) {
                    this._game.combinations.activeCombination = null;
                    return;
                }
                combination.requiresTool = combination.requiresTool === undefined || combination.requiresTool === true ? true : false;
                this._game.combinations.activeCombination = {
                    selectedCombinationAction: combination,
                    selectedTool: null
                };
                this._game.combinations.combinationResult.text = combination.requiresTool ? combination.text : combination.text + ' ' + (combination.preposition || '');
            };
            this.tryCombination = (target) => {
                var combo = this._game.combinations.activeCombination;
                var result = {
                    success: false,
                    text: ''
                };
                if (!target) {
                    return result;
                }
                if (!combo) {
                    var defaultAction = this.getCombinationActions().filter(c => c.isDefault)[0];
                    if (defaultAction) {
                        combo = {
                            selectedCombinationAction: defaultAction,
                            selectedTool: null
                        };
                    }
                }
                if (!combo || !combo.selectedCombinationAction) {
                    return result;
                }
                combo.selectedCombinationAction.preposition = combo.selectedCombinationAction.preposition || '';
                if (combo.selectedCombinationAction.requiresTool && !combo.selectedTool) {
                    this._game.combinations.combinationResult.text = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
                    combo.selectedTool = target;
                    return result;
                }
                result = this.performCombination(target, combo);
                if (result.success) {
                    if (result.removeTarget) {
                        this.removeFeature(target);
                    }
                    if (result.removeTool && combo.selectedTool.id != target.id) {
                        this.removeFeature(combo.selectedTool);
                    }
                    StoryScript.SaveWorldState(this._dataService, this._locationService, this._game);
                }
                this._game.combinations.combinationResult.text = result.text;
                this._game.combinations.combinationResult.done = true;
                return result;
            };
            this.performCombination = (target, combo) => {
                var tool = combo.selectedTool;
                var type = combo.selectedCombinationAction;
                var prepositionText = combo.selectedCombinationAction.preposition ? ' ' + combo.selectedCombinationAction.preposition + ' ' : ' ';
                var text = combo.selectedCombinationAction.requiresTool ? combo.selectedCombinationAction.text + ' ' + tool.name + prepositionText + target.name :
                    combo.selectedCombinationAction.text + prepositionText + target.name;
                this._game.combinations.activeCombination = null;
                var combination = target.combinations && target.combinations.combine ? target.combinations.combine.filter(c => {
                    var toolMatch = type.requiresTool && c.tool && this.isMatch(c.tool, tool);
                    return c.combinationType === type.text && (!type.requiresTool || toolMatch);
                })[0] : null;
                if (!combination) {
                    // For items, the order in which the combination is tried shouldn't matter.
                    var anyTool = tool;
                    if (anyTool && anyTool.type === 'item' && target && anyTool.type === 'item') {
                        combination = tool.combinations && tool.combinations.combine ? tool.combinations.combine.filter(c => c.combinationType === type.text && this.isMatch(c.tool, target))[0] : null;
                    }
                }
                var result = {
                    success: false,
                    text: ''
                };
                if (combination) {
                    var matchResult = combination.match ? combination.match(this._game, target, tool)
                        : combo.selectedCombinationAction.defaultMatch ? combo.selectedCombinationAction.defaultMatch(this._game, target, tool)
                            : undefined;
                    if (matchResult === undefined) {
                        var entity = target;
                        throw new Error(`No match function specified for ${entity.type} ${entity.id} for action ${combination.combinationType}. Neither was a default action specified. Add one or both.`);
                    }
                    result.success = true;
                    result.text = typeof matchResult === 'string' ? matchResult : matchResult.text;
                    result.removeTarget = typeof matchResult !== 'string' && matchResult.removeTarget;
                    result.removeTool = typeof matchResult !== 'string' && matchResult.removeTool;
                }
                else if (target.combinations && target.combinations.failText) {
                    result.text = typeof target.combinations.failText === 'function' ? target.combinations.failText(this._game, target, tool) : target.combinations.failText;
                }
                else if (type.failText) {
                    result.text = typeof type.failText === 'function' ? type.failText(this._game, target, tool) : type.failText;
                }
                else {
                    result.text = tool ? this._texts.format(this._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : this._texts.format(this._texts.noCombinationNoTool, [target.name, type.text, type.preposition]);
                }
                result.text = text + (result.text ? ': ' + result.text : '');
                return result;
            };
            this.isMatch = (combineTool, tool) => {
                var combineId = typeof combineTool === 'function' ? combineTool.name || combineTool.originalFunctionName : combineTool;
                return StoryScript.compareString(tool.id, combineId);
            };
            this.removeFeature = (feature) => {
                // Remove the feature from all possible locations. As we use the object
                // reference, objects of the same type should be left alone.
                this._game.currentLocation.features.remove(feature);
                this._game.currentLocation.destinations.forEach(d => {
                    if (d.barrier === feature) {
                        d.barrier = null;
                    }
                });
                this._game.currentLocation.items.remove(feature);
                this._game.character.items.remove(feature);
                // When equipment can be used in combinations, remove items from the
                // character's equipment as well.
                this._game.currentLocation.enemies.remove(feature);
                this._game.currentLocation.persons.remove(feature);
            };
        }
    }
    StoryScript.CombinationService = CombinationService;
    CombinationService.$inject = ['dataService', 'locationService', 'game', 'rules', 'customTexts'];
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class ConversationService {
        constructor(_dataService, _game) {
            this._dataService = _dataService;
            this._game = _game;
            this.talk = (person) => {
                this.loadConversations();
                this.initConversation(person);
                this._game.playState = StoryScript.PlayState.Conversation;
            };
            this.answer = (node, reply) => {
                var person = this._game.person;
                person.conversation.conversationLog = person.conversation.conversationLog || [];
                person.conversation.conversationLog.push({
                    lines: node.lines,
                    reply: reply.lines
                });
                this.processReply(person, reply);
                var questProgress = reply.questStart || reply.questComplete;
                if (questProgress) {
                    var status = reply.questStart ? 'questStart' : 'questComplete';
                    this.questProgress(status, person, reply);
                }
            };
            this.getLines = (nodeOrReply) => {
                if (nodeOrReply && nodeOrReply.lines) {
                    return nodeOrReply.lines;
                }
                return null;
            };
            this.loadConversations = () => {
                var persons = this._game.currentLocation && this._game.currentLocation.persons;
                if (!persons) {
                    return;
                }
                persons.filter(p => p.conversation && !p.conversation.nodes).forEach((person) => {
                    var htmlDoc = this.loadConversationHtml(person);
                    var defaultReply = this.getDefaultReply(htmlDoc, person);
                    var conversationNodes = htmlDoc.getElementsByTagName('node');
                    person.conversation.nodes = [];
                    this.processConversationNodes(conversationNodes, person, defaultReply);
                    this.checkNodes(person);
                    var nodeToSelect = person.conversation.nodes.filter(n => person.conversation.activeNode && n.node === person.conversation.activeNode.node);
                    person.conversation.activeNode = nodeToSelect.length === 1 ? nodeToSelect[0] : null;
                });
            };
            this.loadConversationHtml = (person) => {
                var conversations = this._dataService.loadDescription('persons', person);
                var parser = new DOMParser();
                if (conversations.indexOf('<conversation>') == -1) {
                    conversations = '<conversation>' + conversations + '</conversation>';
                }
                return parser.parseFromString(conversations, 'text/html');
            };
            this.getDefaultReply = (htmlDoc, person) => {
                var defaultReplyNodes = htmlDoc.getElementsByTagName('default-reply');
                var defaultReply = null;
                if (defaultReplyNodes.length > 1) {
                    throw new Error('More than one default reply in conversation for person ' + person.id + '.');
                }
                else if (defaultReplyNodes.length === 1) {
                    defaultReply = defaultReplyNodes[0].innerHTML.trim();
                }
                return defaultReply;
            };
            this.processConversationNodes = (conversationNodes, person, defaultReply) => {
                for (var i = 0; i < conversationNodes.length; i++) {
                    var node = conversationNodes[i];
                    var newNode = this.getNewNode(person, node);
                    this.processReplyNodes(person, node, newNode, defaultReply);
                    if (!newNode.replies && defaultReply) {
                        newNode.replies = {
                            defaultReply: true,
                            options: [
                                {
                                    lines: defaultReply
                                }
                            ]
                        };
                    }
                    newNode.lines = node.innerHTML.trim();
                    person.conversation.nodes.push(newNode);
                }
            };
            this.getNewNode = (person, node) => {
                var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;
                if (!nameAttribute && console) {
                    console.log('Missing name attribute on node for conversation for person ' + person.id + '. Using \'default\' as default name');
                    nameAttribute = 'default';
                }
                if (person.conversation.nodes.some((node) => { return node.node == nameAttribute; })) {
                    throw new Error('Duplicate nodes with name ' + name + ' for conversation for person ' + person.id + '.');
                }
                return {
                    node: nameAttribute,
                    lines: '',
                    replies: null,
                };
            };
            this.processReplyNodes = (person, node, newNode, defaultReply) => {
                for (var j = 0; j < node.childNodes.length; j++) {
                    var replies = node.childNodes[j];
                    if (StoryScript.compareString(replies.nodeName, 'replies')) {
                        var addDefaultValue = this.GetNodeValue(replies, 'default-reply');
                        var addDefaultReply = StoryScript.compareString(addDefaultValue, 'false') ? false : true;
                        newNode.replies = {
                            defaultReply: addDefaultReply,
                            options: []
                        };
                        this.buildReplies(person, newNode, replies);
                        node.removeChild(replies);
                        if (defaultReply && newNode.replies.defaultReply) {
                            newNode.replies.options.push({
                                lines: defaultReply
                            });
                        }
                    }
                }
            };
            this.buildReplies = (person, newNode, replies) => {
                for (var k = 0; k < replies.childNodes.length; k++) {
                    var replyNode = replies.childNodes[k];
                    if (StoryScript.compareString(replyNode.nodeName, 'reply')) {
                        var requires = this.GetNodeValue(replyNode, 'requires');
                        var linkToNode = this.GetNodeValue(replyNode, 'node');
                        var trigger = this.GetNodeValue(replyNode, 'trigger');
                        var questStart = this.GetNodeValue(replyNode, 'quest-start');
                        var questComplete = this.GetNodeValue(replyNode, 'quest-complete');
                        var setStart = this.GetNodeValue(replyNode, 'set-start');
                        if (trigger && !person.conversation.actions[trigger]) {
                            console.log('No action ' + trigger + ' for node ' + newNode.node + ' found.');
                        }
                        var reply = {
                            requires: requires,
                            linkToNode: linkToNode,
                            trigger: trigger,
                            questStart: questStart,
                            questComplete: questComplete,
                            setStart: setStart,
                            lines: replyNode.innerHTML.trim(),
                        };
                        newNode.replies.options.push(reply);
                    }
                }
            };
            this.checkNodes = (person) => {
                person.conversation.nodes.forEach(n => {
                    if (n.replies && n.replies.options) {
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
            };
            this.GetNodeValue = (node, attribute) => node.attributes[attribute] && node.attributes[attribute].value;
            this.getActiveNode = (person) => {
                if (!person || !person.conversation) {
                    return null;
                }
                var conversation = person.conversation;
                var activeNode = conversation.activeNode;
                if (!activeNode) {
                    activeNode = conversation.selectActiveNode ? conversation.selectActiveNode(this._game, person) : null;
                }
                if (!activeNode) {
                    activeNode = conversation.nodes.filter((node) => { return StoryScript.compareString(node.node, person.conversation.startNode); })[0];
                }
                if (!activeNode) {
                    activeNode = conversation.nodes[0];
                }
                return activeNode;
            };
            this.initReplies = (person) => {
                var activeNode = person.conversation.activeNode;
                if (activeNode.replies) {
                    for (var n in activeNode.replies.options) {
                        var reply = activeNode.replies.options[n];
                        if (reply.linkToNode) {
                            if (!person.conversation.nodes.some((node) => { return node.node === reply.linkToNode; })) {
                                console.log('No node ' + reply.linkToNode + ' found to link to for reply ' + reply.lines + '!');
                            }
                        }
                        if (reply.requires) {
                            reply.available = this.checkReplyAvailability(activeNode, reply);
                        }
                    }
                }
            };
            this.processReply = (person, reply) => {
                if (reply.trigger) {
                    person.conversation.actions[reply.trigger](this._game, person);
                }
                if (reply.setStart) {
                    var startNode = person.conversation.nodes.filter((node) => { return node.node == reply.setStart; })[0];
                    person.conversation.startNode = startNode.node;
                }
                if (reply.linkToNode) {
                    person.conversation.activeNode = person.conversation.nodes.filter((node) => { return node.node == reply.linkToNode; })[0];
                    this.setReplyStatus(person.conversation, person.conversation.activeNode);
                }
                else {
                    person.conversation.activeNode = null;
                }
            };
            this.checkReplyAvailability = (activeNode, reply) => {
                var isAvailable = true;
                var requirements = reply.requires.split(',');
                for (var m in requirements) {
                    var requirement = requirements[m];
                    var values = requirement.toLowerCase().trim().split('=');
                    var type = values[0];
                    var value = values[1];
                    if (!type || !value) {
                        console.log('Invalid reply requirement for node ' + activeNode.node + '!');
                    }
                    isAvailable = this.checkReplyRequirements(activeNode, type, value);
                    if (!isAvailable) {
                        break;
                    }
                }
                return isAvailable;
            };
            this.checkReplyRequirements = (activeNode, type, value) => {
                var isAvailable = true;
                switch (type) {
                    case 'item':
                        {
                            // Check item available. Item list first, equipment second.
                            var hasItem = this._game.character.items.get(value) != undefined;
                            if (!hasItem) {
                                for (var i in this._game.character.equipment) {
                                    var slotItem = this._game.character.equipment[i];
                                    hasItem = slotItem != undefined && slotItem != null && StoryScript.compareString(slotItem.id, value);
                                }
                            }
                            isAvailable = hasItem;
                        }
                        break;
                    case 'location':
                        {
                            // Check location visited
                            var location = this._game.locations.get(value);
                            if (!location) {
                                console.log('Invalid location ' + value + ' for reply requirement for node ' + activeNode.node + '!');
                            }
                            isAvailable = location.hasVisited === true;
                        }
                        break;
                    case 'quest-start':
                    case 'quest-done':
                    case 'quest-complete':
                        {
                            // Check quest start, quest done or quest complete.
                            var quest = this._game.character.quests.get(value);
                            isAvailable = quest != undefined &&
                                (type === 'quest-start' ? true : type === 'quest-done' ?
                                    quest.checkDone(this._game, quest) : quest.completed);
                        }
                        break;
                    default:
                        {
                            // Check attributes
                            var attribute = this._game.character[type];
                            if (!attribute) {
                                console.log('Invalid attribute ' + type + ' for reply requirement for node ' + activeNode.node + '!');
                            }
                            isAvailable = isNaN(this._game.character[type]) ? this._game.character[type] === value : parseInt(this._game.character[type]) >= parseInt(value);
                        }
                        break;
                }
                return isAvailable;
            };
            this.setReplyStatus = (conversation, node) => {
                if (node.replies && node.replies.options) {
                    node.replies.options.forEach(reply => {
                        if (reply.available == undefined) {
                            reply.available = true;
                        }
                        if (reply.showWhenUnavailable == undefined) {
                            reply.showWhenUnavailable = conversation.showUnavailableReplies;
                        }
                    });
                }
            };
            this.questProgress = (type, person, reply) => {
                var quest;
                var start = type === 'questStart';
                if (start) {
                    quest = person.quests.get(reply[type]);
                    if (!quest.started) {
                        quest.issuedBy = person.id;
                        this._game.character.quests.push(quest);
                        person.quests.remove(quest);
                        quest.progress = quest.progress || {};
                        if (quest.start) {
                            quest.start(this._game, quest, person);
                        }
                        quest.started = true;
                        quest.completed = false;
                    }
                }
                else {
                    quest = this._game.character.quests.get(reply[type]);
                    if (!quest.completed) {
                        if (quest.complete) {
                            quest.complete(this._game, quest, person);
                        }
                        quest.completed = true;
                    }
                }
            };
        }
        initConversation(person) {
            this._game.person = person;
            var activeNode = this.getActiveNode(person);
            if (!activeNode) {
                return;
            }
            person.conversation.activeNode = activeNode;
            this.initReplies(person);
            this.setReplyStatus(person.conversation, activeNode);
        }
    }
    StoryScript.ConversationService = ConversationService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class DataService {
        constructor(_localStorageService, _gameNameSpace) {
            this._localStorageService = _localStorageService;
            this._gameNameSpace = _gameNameSpace;
            this.functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;
            this.save = (key, value, pristineValues) => {
                var functions = window.StoryScript.ObjectFactory.GetFunctions();
                var clone = this.buildClone(functions, value, pristineValues);
                this._localStorageService.set(this._gameNameSpace + '_' + key, JSON.stringify({ data: clone }));
            };
            this.copy = (value, pristineValue) => {
                var functions = window.StoryScript.ObjectFactory.GetFunctions();
                return this.buildClone(functions, value, pristineValue);
            };
            this.getSaveKeys = () => this._localStorageService.getKeys(this._gameNameSpace + '_' + StoryScript.DataKeys.GAME + '_');
            this.load = (key) => {
                try {
                    var jsonData = this._localStorageService.get(this._gameNameSpace + '_' + key);
                    if (jsonData) {
                        var data = JSON.parse(jsonData).data;
                        if (StoryScript.isEmpty(data)) {
                            return null;
                        }
                        var functionList = window.StoryScript.ObjectFactory.GetFunctions();
                        this.restoreObjects(functionList, data);
                        StoryScript.setReadOnlyProperties(key, data);
                        return data;
                    }
                    return null;
                }
                catch (exception) {
                    console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
                }
                return null;
            };
            this.loadDescription = (type, item) => {
                var identifier = this.GetIdentifier(type, item);
                if (!this.loadedDescriptions) {
                    this.loadedDescriptions = {};
                }
                var loadedDescription = this.loadedDescriptions[identifier];
                if (loadedDescription) {
                    return loadedDescription;
                }
                var html = this.descriptionBundle.get(identifier);
                if (html === undefined) {
                    console.log('No file ' + identifier + '.html found. Did you create this file already?');
                    this.loadedDescriptions[identifier] = null;
                    return null;
                }
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(html, 'text/html');
                var pictureElement = htmlDoc.getElementsByClassName('picture')[0];
                var pictureSrc = pictureElement && pictureElement.getAttribute('src');
                if (pictureSrc) {
                    item.picture = pictureSrc;
                }
                // Track that this item had a HTML description so it can be re-loaded later.
                item.hasHtmlDescription = true;
                item.description = html;
                this.loadedDescriptions[identifier] = html;
                return html;
            };
            this.hasDescription = (type, item) => {
                var identifier = this.GetIdentifier(type, item);
                return this.descriptionBundle.get(identifier) != null;
            };
            this.GetIdentifier = (type, item) => (StoryScript.getPlural(type) + '/' + item.id).toLowerCase();
            this.buildClone = (functionList, values, pristineValues, clone) => {
                if (!clone) {
                    clone = Array.isArray(values) ? [] : typeof values === 'object' ? {} : values;
                    if (clone == values) {
                        return clone;
                    }
                }
                for (var key in values) {
                    if (!values.hasOwnProperty(key)) {
                        continue;
                    }
                    var value = values[key];
                    if (value === undefined) {
                        continue;
                    }
                    else if (value === null) {
                        clone[key] = null;
                        continue;
                    }
                    else if (value.isProxy) {
                        continue;
                    }
                    // Exclude hashkeys used by angularjs.
                    else if (key.indexOf('$$hashKey') > -1) {
                        continue;
                    }
                    this.getClonedValue(functionList, clone, value, key, pristineValues);
                }
                return clone;
            };
            this.getClonedValue = (functionList, clone, value, key, pristineValues) => {
                var pristineValue = pristineValues && pristineValues.hasOwnProperty(key) ? pristineValues[key] : undefined;
                if (Array.isArray(value)) {
                    clone[key] = [];
                    this.buildClone(functionList, value, pristineValue, clone[key]);
                    var additionalArrayProperties = Object.keys(value).filter(v => {
                        var isAdditionalProperty = isNaN(parseInt(v));
                        if (isAdditionalProperty) {
                            if (v === 'push' || (value[v].name === 'push') && value[v].isProxy) {
                                isAdditionalProperty = false;
                            }
                        }
                        return isAdditionalProperty;
                    });
                    additionalArrayProperties.forEach(p => {
                        var arrayPropertyKey = `${key}_arrProps`;
                        clone[arrayPropertyKey] = {};
                        this.getClonedValue(functionList, clone[arrayPropertyKey], value[p], p, pristineValue);
                    });
                }
                else if (typeof value === 'object') {
                    if (Array.isArray(clone)) {
                        clone.push({});
                    }
                    else {
                        clone[key] = {};
                    }
                    this.buildClone(functionList, value, pristineValue, clone[key]);
                }
                else if (typeof value === 'function') {
                    this.getClonedFunction(functionList, clone, value, key);
                }
                else {
                    clone[key] = value;
                }
            };
            this.getClonedFunction = (functionList, clone, value, key) => {
                if (!value.isProxy) {
                    if (value.functionId) {
                        var parts = this.GetFunctionIdParts(value.functionId);
                        var plural = StoryScript.getPlural(parts.type);
                        if (parts.type === 'action' && !functionList[plural][parts.functionId]) {
                            var match = null;
                            for (var n in functionList[plural]) {
                                var entry = functionList[plural][n];
                                if (entry.hash === parts.hash) {
                                    match = n;
                                    break;
                                }
                            }
                            if (match) {
                                clone[key] = 'function#' + plural + '|' + match + '#' + parts.hash;
                            }
                            else {
                                clone[key] = value.toString();
                            }
                        }
                        else {
                            clone[key] = value.functionId;
                        }
                    }
                    else {
                        // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
                        // to a function. Convert values that have an arrow notation.
                        let functionString = value.toString();
                        if (functionString.indexOf('function') == -1) {
                            var arrowIndex = functionString.indexOf('=>');
                            functionString = 'function' + functionString.match(this.functionArgumentRegex)[0] + functionString.substring(arrowIndex + 2).trim();
                        }
                        clone[key] = functionString;
                    }
                }
            };
            this.restoreObjects = (functionList, loaded) => {
                for (var key in loaded) {
                    if (!loaded.hasOwnProperty(key)) {
                        continue;
                    }
                    var value = loaded[key];
                    if (value === undefined) {
                        continue;
                    }
                    else if (Array.isArray(value)) {
                        StoryScript.initCollection(loaded, key);
                        this.restoreObjects(functionList, value);
                        var arrayPropertyKey = `${key}_arrProps`;
                        var additionalArrayProperties = loaded[arrayPropertyKey];
                        if (additionalArrayProperties) {
                            Object.keys(additionalArrayProperties).forEach(k => {
                                value[k] = additionalArrayProperties[k];
                            });
                            delete loaded[arrayPropertyKey];
                        }
                    }
                    else if (typeof value === 'object') {
                        this.restoreObjects(functionList, value);
                    }
                    else if (typeof value === 'string') {
                        this.restoreFunction(functionList, loaded, value, key);
                    }
                }
            };
            this.restoreFunction = (functionList, loaded, value, key) => {
                if (value.indexOf('function#') > -1) {
                    var parts = this.GetFunctionIdParts(value);
                    var type = StoryScript.getPlural(parts.type);
                    var typeList = functionList[type];
                    if (!typeList[parts.functionId]) {
                        console.log('Function with key: ' + parts.functionId + ' could not be found!');
                    }
                    else if (typeList[parts.functionId].hash != parts.hash) {
                        console.log('Function with key: ' + parts.functionId + ' was found but the hash does not match the stored hash!');
                    }
                    loaded[key] = typeList[parts.functionId].function;
                }
                else if (typeof value === 'string' && value.indexOf('function') > -1) {
                    loaded[key] = value.parseFunction();
                }
            };
            this.GetFunctionIdParts = (value) => {
                var parts = value.split('#');
                var functionPart = parts[1];
                var functionParts = functionPart.split('|');
                var type = functionParts[0];
                functionParts.splice(0, 1);
                var functionId = functionParts.join('|');
                var hash = parseInt(parts[2]);
                return {
                    type: type,
                    functionId: functionId,
                    hash: hash
                };
            };
            this.descriptionBundle = window.StoryScript.GetGameDescriptions();
        }
    }
    StoryScript.DataService = DataService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    const STORYSCRIPTKEY = 'StoryScript';
    class LocalStorageService {
        constructor() {
            this.get = (key) => localStorage.getItem(STORYSCRIPTKEY + '_' + key);
            this.set = (key, value) => localStorage.setItem(STORYSCRIPTKEY + '_' + key, value);
            this.getKeys = (prefix) => {
                var result = [];
                prefix = STORYSCRIPTKEY + '_' + prefix;
                for (var key in localStorage) {
                    if (localStorage.hasOwnProperty(key) && key.startsWith(prefix)) {
                        result.push(key.replace(prefix, ''));
                    }
                }
                return result;
            };
        }
    }
    StoryScript.LocalStorageService = LocalStorageService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class LocationService {
        constructor(_dataService, _rules, _game, _definitions) {
            this._dataService = _dataService;
            this._rules = _rules;
            this._game = _game;
            this._definitions = _definitions;
            this.init = (game, buildWorld) => {
                game.currentLocation = null;
                game.previousLocation = null;
                game.locations = this.loadWorld(buildWorld === undefined || buildWorld);
            };
            this.saveWorld = (locations) => this._dataService.save(StoryScript.DataKeys.WORLD, locations, this.pristineLocations);
            this.copyWorld = () => this._dataService.copy(this._game.locations, this.pristineLocations);
            this.changeLocation = (location, travel, game) => {
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
            };
            this.switchLocation = (game, location) => {
                var presentLocation;
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
            };
            this.processDestinations = (game) => {
                if (game.currentLocation.destinations) {
                    // remove the return message from the current location destinations.
                    game.currentLocation.destinations.forEach(destination => {
                        if (destination.isPreviousLocation) {
                            destination.isPreviousLocation = false;
                        }
                    });
                    // Mark the previous location in the current location's destinations to allow
                    // the player to more easily backtrack his last step. Also, check if the user
                    // has the key for one or more barriers at this location, and add the key actions
                    // if that is the case.
                    game.currentLocation.destinations.forEach(destination => {
                        if (game.previousLocation && destination.target && destination.target == game.previousLocation.id) {
                            destination.isPreviousLocation = true;
                        }
                        addKeyAction(game, destination);
                    });
                    game.currentLocation.destinations.forEach(destination => {
                        if (destination.barrier && destination.barrier.actions) {
                            destination.barrier.selectedAction = destination.barrier.actions[0];
                        }
                    });
                }
            };
            this.saveLocations = (game) => {
                // Save the previous and current location, then get the location text.
                this._dataService.save(StoryScript.DataKeys.LOCATION, game.currentLocation.id);
                if (game.previousLocation) {
                    this._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, game.previousLocation.id);
                }
            };
            this.playEnterEvents = (game) => {
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
            };
            this.loadWorld = (buildWorld) => {
                const locations = this.getLocations(buildWorld);
                locations.forEach(l => this.initDestinations(l));
                return locations;
            };
            this.getLocations = (buildWorld) => {
                var locations = null;
                if (buildWorld) {
                    this.pristineLocations = this.buildWorld();
                    locations = this._dataService.load(StoryScript.DataKeys.WORLD);
                    if (StoryScript.isEmpty(locations)) {
                        this._dataService.save(StoryScript.DataKeys.WORLD, this.pristineLocations, this.pristineLocations);
                        locations = this._dataService.load(StoryScript.DataKeys.WORLD);
                    }
                }
                else {
                    locations = this._game.locations;
                }
                return locations;
            };
            this.initDestinations = (location) => {
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
                            });
                        }
                    });
                }
                Object.defineProperty(location, 'activeDestinations', {
                    get: function () {
                        return location.destinations.filter(e => { return !e.inactive; });
                    }
                });
            };
            this.initTrade = (game) => {
                if (game.currentLocation.trade && (!game.currentLocation.actions || !game.currentLocation.actions.some(a => a.actionType == StoryScript.ActionType.Trade))) {
                    game.currentLocation.actions.push({
                        text: game.currentLocation.trade.title,
                        actionType: StoryScript.ActionType.Trade,
                        execute: 'trade'
                    });
                }
            };
            this.buildWorld = () => {
                var locations = this._definitions.locations;
                var compiledLocations = [];
                this.processLocations(locations, compiledLocations);
                return compiledLocations;
            };
            this.processLocations = (locations, compiledLocations) => {
                for (var n in locations) {
                    var definition = locations[n];
                    var location = definition();
                    this.setDestinations(location);
                    compiledLocations.push(location);
                }
            };
            this.setDestinations = (location) => {
                if (location.destinations) {
                    location.destinations.forEach(destination => {
                        setDestination(destination);
                    });
                }
            };
            this.addDestination = (originalScope, originalFunction, destination, game) => {
                setDestination(destination);
                addKeyAction(game, destination);
                originalFunction.call(originalScope, destination);
            };
            this.playEvents = (game, events) => {
                for (var n in events) {
                    events[n](game);
                }
            };
            this.loadLocationDescriptions = (game) => {
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
            };
            this.processDescriptions = (htmlDoc, game) => {
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
            };
            this.processTextFeatures = (game) => {
                if (!game.currentLocation.text) {
                    return;
                }
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(game.currentLocation.text, 'text/html');
                var featureNodes = htmlDoc.getElementsByTagName('feature');
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
                        node.innerHTML = StoryScript.addHtmlSpaces(feature.description);
                    }
                }
                game.currentLocation.text = htmlDoc.body.innerHTML;
            };
            this.processVisualFeatures = (htmlDoc, game) => {
                var visualFeatureNode = htmlDoc.getElementsByTagName('visual-features')[0];
                if (visualFeatureNode) {
                    game.currentLocation.features.collectionPicture = visualFeatureNode.attributes['img'] && visualFeatureNode.attributes['img'].nodeValue;
                    if (game.currentLocation.features && game.currentLocation.features.length > 0 && visualFeatureNode) {
                        var areaNodes = visualFeatureNode.getElementsByTagName('area');
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
            };
            this.getBasicFeatureData = (game, node) => {
                var nameAttribute = node.attributes['name'] && node.attributes['name'].nodeValue;
                if (!nameAttribute) {
                    throw new Error('There is no name attribute for a feature node for location ' + game.currentLocation.id + '.');
                }
                return game.currentLocation.features.filter(f => StoryScript.compareString(f.id, nameAttribute))[0];
            };
            this.selectLocationDescription = (game) => {
                var selector = null;
                if (!game.currentLocation.descriptions) {
                    return;
                }
                // A location can specify how to select the proper selection using a descriptor selection function. If it is not specified,
                // use the default description selector function.
                if (game.currentLocation.descriptionSelector) {
                    // Use this casting to allow the description selector to be a function or a string.
                    selector = typeof game.currentLocation.descriptionSelector == 'function' ? game.currentLocation.descriptionSelector(game) : game.currentLocation.descriptionSelector;
                    game.currentLocation.text = game.currentLocation.descriptions[selector];
                }
                else if (this._rules.exploration && this._rules.exploration.descriptionSelector && (selector = this._rules.exploration.descriptionSelector(game))) {
                    game.currentLocation.text = game.currentLocation.descriptions[selector] || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[0];
                }
                else {
                    game.currentLocation.text = game.currentLocation.text || game.currentLocation.descriptions['default'] || game.currentLocation.descriptions[Object.keys(game.currentLocation.descriptions)[0]];
                }
            };
        }
    }
    StoryScript.LocationService = LocationService;
    function addKeyAction(game, destination) {
        if (destination.barrier && destination.barrier.key) {
            var key = typeof destination.barrier.key === 'function' ? destination.barrier.key() : game.helpers.getItem(destination.barrier.key);
            var existingAction = null;
            var keyActionHash = StoryScript.createFunctionHash(key.open.execute);
            if (destination.barrier.actions) {
                destination.barrier.actions.forEach(x => {
                    if (StoryScript.createFunctionHash(x.execute) === keyActionHash) {
                        existingAction = x;
                    }
                    ;
                });
            }
            else {
                destination.barrier.actions = [];
            }
            if (existingAction) {
                destination.barrier.actions.splice(destination.barrier.actions.indexOf(existingAction), 1);
            }
            var keyId = key.id;
            var barrierKey = (game.character.items.get(keyId) || game.currentLocation.items.get(keyId));
            if (barrierKey) {
                destination.barrier.actions.push(barrierKey.open);
            }
        }
    }
    function setDestination(destination) {
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
                    var tool = combination.tool;
                    combination.tool = tool && (tool.name || tool.originalFunctionName).toLowerCase();
                }
            }
        }
    }
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class TradeService {
        constructor(_game, _texts) {
            this._game = _game;
            this._texts = _texts;
            this.trade = (trade) => {
                var isPerson = trade && trade['type'] === 'person';
                this._game.trade = isPerson ? trade.trade : this._game.currentLocation.trade;
                var trader = this._game.trade;
                if (isPerson) {
                    trader.currency = trade.currency;
                    this._game.person = trade;
                    if (!trader.title) {
                        trader.title = this._texts.format(this._texts.trade, [trade.name]);
                    }
                }
                this.initTrade();
                this._game.playState = StoryScript.PlayState.Trade;
            };
            this.canPay = (currency, value) => (value != undefined && currency != undefined && currency >= value) || value == 0;
            this.actualPrice = (item, modifier) => {
                modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? modifier(this._game) : modifier;
                return Math.round(item.value * modifier);
            };
            this.displayPrice = (item, actualPrice) => actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + this._texts.currency) : item.name;
            this.buy = (item, trade) => {
                if (!this.pay(item, trade, trade.buy, this._game.character, false)) {
                    return false;
                }
                this._game.character.items.push(item);
                trade.buy.items.remove(item);
                if (trade.onBuy) {
                    trade.onBuy(this._game, item);
                }
                return true;
            };
            this.sell = (item, trade) => {
                if (!this.pay(item, trade, trade.sell, this._game.character, true)) {
                    return false;
                }
                ;
                this._game.character.items.remove(item);
                trade.sell.items.remove(item);
                trade.buy.items.push(item);
                if (trade.onSell) {
                    trade.onSell(this._game, item);
                }
                return true;
            };
            this.initTrade = () => {
                var trader = this._game.trade;
                if (!trader) {
                    return null;
                }
                var itemsForSale = trader.buy.items ? trader.buy.items.slice() : undefined;
                var buySelector = (item) => {
                    return trader.buy.itemSelector(this._game, item);
                };
                if ((trader.initCollection && trader.initCollection(this._game, trader) || !itemsForSale)) {
                    // Change this when more than one trade per location is allowed.
                    var collection = (trader.ownItemsOnly ? this._game.person.items : this._game.definitions.items);
                    itemsForSale = StoryScript.randomList(collection, trader.buy.maxItems, 'items', this._game.definitions, buySelector);
                }
                var sellSelector = (item) => {
                    return trader.sell.itemSelector(this._game, item);
                };
                var itemsToSell = StoryScript.randomList(this._game.character.items, trader.sell.maxItems, 'items', this._game.definitions, sellSelector);
                if (!trader.buy.items) {
                    trader.buy.items = [];
                }
                trader.buy.items.length = 0;
                itemsForSale.forEach(i => trader.buy.items.push(i));
                if (!trader.sell.items) {
                    trader.sell.items = [];
                }
                trader.sell.items.length = 0;
                itemsToSell.forEach(i => trader.sell.items.push(i));
                return trader;
            };
            this.pay = (item, trader, stock, character, characterSells) => {
                var price = item.value;
                if (stock.priceModifier != undefined) {
                    var modifier = typeof stock.priceModifier === 'function' ? stock.priceModifier(this._game) : stock.priceModifier;
                    price = Math.round(item.value * modifier);
                }
                character.currency = character.currency || 0;
                trader.currency = trader.currency || 0;
                var canAffort = characterSells ? trader.currency - price >= 0 : character.currency - price >= 0;
                if (canAffort) {
                    character.currency = characterSells ? character.currency + price : character.currency - price;
                    if (trader.currency != undefined) {
                        trader.currency = characterSells ? trader.currency - price : trader.currency + price;
                    }
                    if (this._game.person && this._game.person.trade === this._game.trade) {
                        this._game.person.currency = this._game.trade.currency;
                    }
                }
                return canAffort;
            };
        }
    }
    StoryScript.TradeService = TradeService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class CharacterService {
        constructor(_game, _rules) {
            this._game = _game;
            this._rules = _rules;
            this.getSheetAttributes = () => this._rules.character.getSheetAttributes && this._rules.character.getSheetAttributes() || [];
            this.setupCharacter = () => {
                var sheet = (this._rules.character.getCreateCharacterSheet && this._rules.character.getCreateCharacterSheet()) || { steps: [] };
                this.prepareSheet(sheet);
                this._game.createCharacterSheet = sheet;
                return sheet;
            };
            this.limitSheetInput = (value, attribute, entry) => {
                if (!isNaN(value)) {
                    var totalAssigned = 0;
                    attribute.entries.forEach((innerEntry, index) => {
                        if (index !== attribute.entries.indexOf(entry)) {
                            totalAssigned += innerEntry.value || 1;
                        }
                    });
                    if (totalAssigned + value > attribute.numberOfPointsToDistribute) {
                        value = attribute.numberOfPointsToDistribute - totalAssigned;
                    }
                    entry.value = value;
                    if (entry.value > entry.max) {
                        entry.value = entry.max;
                    }
                    else if (entry.value < entry.min) {
                        entry.value = entry.min;
                    }
                }
                else {
                    entry.value = entry.min;
                }
            };
            this.distributionDone = (sheet, step) => {
                var done = true;
                if (step) {
                    done = this.checkStep(step);
                }
                else {
                    if (sheet && sheet.steps) {
                        sheet.steps.forEach(step => {
                            done = this.checkStep(step);
                        });
                    }
                }
                return done;
            };
            this.createCharacter = (game, characterData) => {
                var character = null;
                if (this._rules.character.createCharacter) {
                    character = this._rules.character.createCharacter(game, characterData);
                    this.processDefaultSettings(character, characterData);
                }
                else {
                    // Set a placeholder character to keep the game logic functional when no character is used.
                    character = {
                        name: null
                    };
                }
                return character;
            };
            this.setupLevelUp = () => {
                var sheet = this._rules.character.getLevelUpSheet && this._rules.character.getLevelUpSheet();
                if (sheet) {
                    this.prepareSheet(sheet);
                    this._game.createCharacterSheet = sheet;
                }
                return sheet;
            };
            this.levelUp = () => {
                var character = this._game.character;
                var sheet = this._game.createCharacterSheet;
                if (this._rules.character.levelUp && this._rules.character.levelUp(character, sheet)) {
                    this.processDefaultSettings(character, sheet);
                }
                this._game.state = StoryScript.GameState.Play;
                return character;
            };
            this.pickupItem = (item) => {
                var isCombining = this._game.combinations && this._game.combinations.activeCombination;
                if (isCombining) {
                    this._game.combinations.tryCombine(item);
                    return false;
                }
                this._game.character.items.push(item);
                this._game.currentLocation.items.remove(item);
                return true;
            };
            this.canEquip = (item) => item.equipmentType != StoryScript.EquipmentType.Miscellaneous;
            this.equipItem = (item) => {
                var equipmentTypes = Array.isArray(item.equipmentType) ? item.equipmentType : [item.equipmentType];
                for (var n in equipmentTypes) {
                    var type = this.getEquipmentType(equipmentTypes[n]);
                    var unequipped = this.unequip(type);
                    if (!unequipped) {
                        return false;
                    }
                }
                if (this._rules.character.beforeEquip) {
                    if (!this._rules.character.beforeEquip(this._game, this._game.character, item)) {
                        return false;
                    }
                }
                if (item.equip) {
                    if (!item.equip(item, this._game)) {
                        return false;
                    }
                }
                for (var n in equipmentTypes) {
                    var type = this.getEquipmentType(equipmentTypes[n]);
                    this._game.character.equipment[type] = item;
                }
                this._game.character.items.remove(item);
                return true;
            };
            this.unequipItem = (item) => {
                var equipmentTypes = Array.isArray(item.equipmentType) ? item.equipmentType : [item.equipmentType];
                for (var n in equipmentTypes) {
                    var type = this.getEquipmentType(equipmentTypes[n]);
                    var unequipped = this.unequip(type);
                    if (!unequipped) {
                        return false;
                    }
                }
                return true;
            };
            this.isSlotUsed = (slot) => {
                if (this._game.character && this._game.character.equipment) {
                    return this._game.character.equipment[slot] !== undefined;
                }
                return false;
            };
            this.dropItem = (item) => {
                if (!item) {
                    return;
                }
                var drop = true;
                if (this._rules.character.beforeDrop) {
                    drop = this._rules.character.beforeDrop(this._game, this._game.character, item);
                }
                if (drop) {
                    this._game.character.items.remove(item);
                    this._game.currentLocation.items.push(item);
                }
            };
            this.questStatus = (quest) => typeof quest.status === 'function' ? quest.status(this._game, quest, quest.checkDone(this._game, quest)) : quest.status;
            this.prepareSheet = (sheet) => {
                if (sheet.steps.length == 0) {
                    return;
                }
                sheet.currentStep = 0;
                if (sheet.steps[0].questions && sheet.steps[0].questions[0].entries) {
                    sheet.steps[0].questions[0].selectedEntry = sheet.steps[0].questions[0].entries[0];
                }
                this.setFinish(sheet);
                sheet.nextStep = (data, next) => {
                    if (next !== undefined && next !== null && !next) {
                        this.setFinish(data);
                        return;
                    }
                    var selector = data.steps[data.currentStep].nextStepSelector;
                    var previousStep = data.currentStep;
                    if (selector) {
                        var nextStep = typeof selector === 'function' ? selector(data, data.steps[data.currentStep]) : selector;
                        data.currentStep = nextStep;
                    }
                    else {
                        data.currentStep++;
                    }
                    var currentStep = data.steps[data.currentStep];
                    if (currentStep.initStep) {
                        currentStep.initStep(data, previousStep, currentStep);
                    }
                    if (currentStep.attributes) {
                        currentStep.attributes.forEach(attr => {
                            attr.entries.forEach(entry => {
                                if (entry.min) {
                                    entry.value = entry.min;
                                }
                            });
                        });
                    }
                    if (currentStep.questions) {
                        currentStep.questions.forEach(question => {
                            if (question.entries && question.entries.length) {
                                question.selectedEntry = question.entries[0];
                            }
                        });
                    }
                };
            };
            this.checkStep = (step) => {
                var done = true;
                if (step.attributes) {
                    step.attributes.forEach(attr => {
                        var totalAssigned = 0;
                        var textChoicesFilled = 0;
                        attr.entries.forEach((entry) => {
                            if (!entry.max) {
                                if (entry.value) {
                                    textChoicesFilled += 1;
                                }
                            }
                            else {
                                totalAssigned += entry.value || 1;
                            }
                        });
                        done = totalAssigned === attr.numberOfPointsToDistribute || textChoicesFilled === attr.entries.length;
                    });
                }
                return done;
            };
            this.processDefaultSettings = (character, characterData) => {
                if (!characterData.steps) {
                    return;
                }
                characterData.steps.forEach(step => {
                    if (step.questions) {
                        step.questions.forEach(question => {
                            if (question.selectedEntry && character.hasOwnProperty(question.selectedEntry.value)) {
                                character[question.selectedEntry.value] += question.selectedEntry.bonus;
                            }
                        });
                    }
                });
                characterData.steps.forEach(step => {
                    if (step.attributes) {
                        step.attributes.forEach(attribute => {
                            attribute.entries.forEach(entry => {
                                if (character.hasOwnProperty(entry.attribute)) {
                                    character[entry.attribute] = entry.value;
                                }
                            });
                        });
                    }
                });
            };
            this.unequip = (type, currentItem) => {
                var equippedItem = this._game.character.equipment[type];
                if (equippedItem) {
                    if (Array.isArray(equippedItem.equipmentType) && !currentItem) {
                        for (var n in equippedItem.equipmentType) {
                            var type = this.getEquipmentType(equippedItem.equipmentType[n]);
                            var unEquipped = this.unequip(type, equippedItem);
                            if (!unEquipped) {
                                return false;
                            }
                        }
                        return true;
                    }
                    if (this._rules.character.beforeUnequip) {
                        if (!this._rules.character.beforeUnequip(this._game, this._game.character, equippedItem)) {
                            return false;
                        }
                    }
                    if (equippedItem.unequip) {
                        if (!equippedItem.unequip(equippedItem, this._game)) {
                            return false;
                        }
                    }
                    if (equippedItem && !isNaN(equippedItem.equipmentType) && !this._game.character.items.get(equippedItem)) {
                        this._game.character.items.push(equippedItem);
                    }
                    this._game.character.equipment[type] = null;
                }
                return true;
            };
            this.getEquipmentType = (slot) => {
                var type = StoryScript.EquipmentType[slot];
                return type.substring(0, 1).toLowerCase() + type.substring(1);
            };
            this.setFinish = (data) => {
                if (data && data.steps) {
                    var activeStep = data.steps[data.currentStep];
                    if (activeStep.questions) {
                        activeStep.finish = activeStep.questions.filter(q => q.selectedEntry.finish).length > 0;
                    }
                }
            };
        }
    }
    StoryScript.CharacterService = CharacterService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class GameService {
        constructor(_dataService, _locationService, _characterService, _combinationService, _rules, _helperService, _game, _texts) {
            this._dataService = _dataService;
            this._locationService = _locationService;
            this._characterService = _characterService;
            this._combinationService = _combinationService;
            this._rules = _rules;
            this._helperService = _helperService;
            this._game = _game;
            this._texts = _texts;
            this.mediaTags = ['autoplay="autoplay"', 'autoplay=""', 'autoplay'];
            this._musicStopped = false;
            this.init = (restart, skipIntro) => {
                this._game.helpers = this._helperService;
                if (restart) {
                    this._game.statistics = {};
                    this._game.worldProperties = {};
                }
                if (this._rules.setup && this._rules.setup.setupGame) {
                    this._rules.setup.setupGame(this._game);
                }
                this.setupGame();
                this.initTexts();
                this._game.highScores = this._dataService.load(StoryScript.DataKeys.HIGHSCORES);
                this._game.character = this._dataService.load(StoryScript.DataKeys.CHARACTER);
                if (!restart) {
                    this._game.statistics = this._dataService.load(StoryScript.DataKeys.STATISTICS) || this._game.statistics || {};
                    this._game.worldProperties = this._dataService.load(StoryScript.DataKeys.WORLDPROPERTIES) || this._game.worldProperties || {};
                }
                if (!this._game.character && this._rules.setup.intro && !skipIntro) {
                    this._game.state = StoryScript.GameState.Intro;
                    return;
                }
                var locationName = this._dataService.load(StoryScript.DataKeys.LOCATION);
                var characterSheet = this._rules.character.getCreateCharacterSheet && this._rules.character.getCreateCharacterSheet();
                var hasCreateCharacterSteps = characterSheet && characterSheet.steps && characterSheet.steps.length > 0;
                if (!hasCreateCharacterSteps && !this._game.character) {
                    this.createCharacter({});
                    locationName = 'Start';
                }
                if (this._game.character && locationName) {
                    this.initSetInterceptors();
                    this.resume(locationName);
                }
                else {
                    this._characterService.setupCharacter();
                    this._game.state = StoryScript.GameState.CreateCharacter;
                }
            };
            this.reset = () => {
                this._dataService.save(StoryScript.DataKeys.WORLD, {});
                this._locationService.init(this._game);
                this._game.worldProperties = this._dataService.load(StoryScript.DataKeys.WORLDPROPERTIES);
                var location = this._dataService.load(StoryScript.DataKeys.LOCATION);
                if (location) {
                    this._locationService.changeLocation(location, false, this._game);
                }
            };
            this.startNewGame = (characterData) => {
                this.createCharacter(characterData);
                if (this._rules.setup.gameStart) {
                    this._rules.setup.gameStart(this._game);
                }
                if (!this._game.currentLocation) {
                    this._game.changeLocation('Start');
                }
                this.initSetInterceptors();
                this._game.state = StoryScript.GameState.Play;
                this.saveGame();
            };
            this.levelUp = () => {
                var levelUpResult = this._characterService.levelUp();
                this.saveGame();
                return levelUpResult;
            };
            this.restart = (skipIntro) => {
                this._dataService.save(StoryScript.DataKeys.CHARACTER, {});
                this._dataService.save(StoryScript.DataKeys.STATISTICS, {});
                this._dataService.save(StoryScript.DataKeys.LOCATION, '');
                this._dataService.save(StoryScript.DataKeys.PREVIOUSLOCATION, '');
                this._dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, {});
                this._dataService.save(StoryScript.DataKeys.WORLD, {});
                this.init(true, skipIntro);
            };
            this.saveGame = (name) => {
                if (name) {
                    var saveGame = {
                        name: name,
                        character: this._game.character,
                        world: this._locationService.copyWorld(),
                        worldProperties: this._game.worldProperties,
                        statistics: this._game.statistics,
                        location: this._game.currentLocation && this._game.currentLocation.id,
                        previousLocation: this._game.previousLocation ? this._game.previousLocation.id : null,
                        state: this._game.state
                    };
                    this._dataService.save(StoryScript.DataKeys.GAME + '_' + name, saveGame);
                    if (this._game.playState === StoryScript.PlayState.Menu) {
                        this._game.playState = null;
                    }
                }
                else {
                    StoryScript.SaveWorldState(this._dataService, this._locationService, this._game);
                }
            };
            this.loadGame = (name) => {
                var saveGame = this._dataService.load(StoryScript.DataKeys.GAME + '_' + name);
                if (saveGame) {
                    this._game.loading = true;
                    this._game.character = saveGame.character;
                    this._game.locations = saveGame.world;
                    this._game.worldProperties = saveGame.worldProperties;
                    this._locationService.init(this._game, false);
                    this._game.currentLocation = this._game.locations.get(saveGame.location);
                    if (saveGame.previousLocation) {
                        this._game.previousLocation = this._game.locations.get(saveGame.previousLocation);
                    }
                    StoryScript.SaveWorldState(this._dataService, this._locationService, this._game);
                    this._dataService.save(StoryScript.DataKeys.LOCATION, this._game.currentLocation.id);
                    this._game.actionLog = [];
                    this._game.state = saveGame.state;
                    this.initSetInterceptors();
                    if (this._game.playState === StoryScript.PlayState.Menu) {
                        this._game.playState = null;
                    }
                    this._game.combinations.combinationResult.reset();
                    setTimeout(() => {
                        this._game.loading = false;
                    }, 0);
                }
            };
            this.getSaveGames = () => this._dataService.getSaveKeys();
            this.hasDescription = (type, item) => this._dataService.hasDescription(type, item);
            this.getDescription = (type, entity, key) => {
                var description = entity && entity[key] ? entity[key] : null;
                if (!description) {
                    this._dataService.loadDescription(type, entity);
                    description = entity[key];
                }
                if (description) {
                    this.processMediaTags(entity, key);
                }
                return description;
            };
            this.setCurrentDescription = (type, item, title) => {
                if (item.description === undefined || item.description === null) {
                    item.description = this.getDescription(type, item, 'description');
                }
                this._game.currentDescription = {
                    title: title,
                    type: type,
                    item: item
                };
            };
            this.initCombat = () => {
                if (this._rules.combat && this._rules.combat.initCombat) {
                    this._rules.combat.initCombat(this._game, this._game.currentLocation);
                }
                this._game.currentLocation.activeEnemies.forEach(enemy => {
                    if (enemy.onAttack) {
                        enemy.onAttack(this._game);
                    }
                });
            };
            this.fight = (enemy, retaliate) => {
                if (!this._rules.combat || !this._rules.combat.fight) {
                    return;
                }
                this._rules.combat.fight(this._game, enemy, retaliate);
                if (enemy.hitpoints <= 0) {
                    this.enemyDefeated(enemy);
                }
                if (this._game.character.currentHitpoints <= 0) {
                    this._game.playState = null;
                    this._game.state = StoryScript.GameState.GameOver;
                }
                this.saveGame();
            };
            this.useItem = (item) => item.use(this._game, item);
            this.executeBarrierAction = (barrier, destination) => {
                if (StoryScript.isEmpty(barrier.actions)) {
                    return;
                }
                var actionIndex = barrier.actions.indexOf(barrier.selectedAction);
                barrier.selectedAction.execute(this._game, barrier, destination);
                barrier.actions.splice(actionIndex, 1);
                if (barrier.actions.length) {
                    barrier.selectedAction = barrier.actions[0];
                }
                this.saveGame();
            };
            this.getCurrentMusic = () => {
                var currentEntry = !this._musicStopped && this._rules.setup.playList && this._rules.setup.playList.filter(e => this._game.playState ? e[0] === this._game.playState : e[0] === this._game.state)[0];
                return currentEntry && currentEntry[1];
            };
            this.startMusic = () => this._musicStopped = false;
            this.stopMusic = () => this._musicStopped = true;
            this.initTexts = () => {
                var defaultTexts = new StoryScript.DefaultTexts();
                for (var n in defaultTexts.texts) {
                    this._texts[n] = this._texts[n] ? this._texts[n] : defaultTexts.texts[n];
                }
                this._texts.format = defaultTexts.format;
                this._texts.titleCase = defaultTexts.titleCase;
            };
            this.resume = (locationName) => {
                var lastLocation = this._game.locations.get(locationName) || this._game.locations.get('start');
                var previousLocationName = this._dataService.load(StoryScript.DataKeys.PREVIOUSLOCATION);
                if (previousLocationName) {
                    this._game.previousLocation = this._game.locations.get(previousLocationName);
                }
                // Reset loading descriptions so changes to the descriptions are shown right away instead of requiring a world reset.
                this.resetLoadedHtml(this._game.locations);
                this.resetLoadedHtml(this._game.character);
                this._locationService.changeLocation(lastLocation.id, false, this._game);
                this._game.state = StoryScript.GameState.Play;
            };
            this.createCharacter = (characterData) => {
                var character = this._characterService.createCharacter(this._game, characterData);
                character.items = character.items || [];
                character.quests = character.quests || [];
                this._dataService.save(StoryScript.DataKeys.CHARACTER, character);
                this._game.character = this._dataService.load(StoryScript.DataKeys.CHARACTER);
            };
            this.enemyDefeated = (enemy) => {
                if (enemy.items) {
                    enemy.items.forEach((item) => {
                        this._game.currentLocation.items.push(item);
                    });
                    enemy.items.length = 0;
                }
                this._game.character.currency = this._game.character.currency || 0;
                this._game.character.currency += enemy.currency || 0;
                this._game.statistics.enemiesDefeated = this._game.statistics.enemiesDefeated || 0;
                this._game.statistics.enemiesDefeated += 1;
                this._game.currentLocation.enemies.remove(enemy);
                if (this._rules.combat && this._rules.combat.enemyDefeated) {
                    this._rules.combat.enemyDefeated(this._game, enemy);
                }
                if (enemy.onDefeat) {
                    enemy.onDefeat(this._game);
                }
            };
            this.setupGame = () => {
                this.initLogs();
                this._game.fight = this.fight;
                this._game.sounds = {
                    startMusic: this.startMusic,
                    stopMusic: this.stopMusic
                };
                this.setupCombinations();
                this._locationService.init(this._game);
                this._game.changeLocation = (location, travel) => {
                    this._locationService.changeLocation(location, travel, this._game);
                    if (travel) {
                        this.saveGame();
                    }
                };
            };
            this.initSetInterceptors = () => {
                let currentHitpoints = this._game.character.currentHitpoints || this._game.character.hitpoints;
                let score = this._game.character.score || 0;
                let gameState = this._game.state;
                Object.defineProperty(this._game.character, 'currentHitpoints', {
                    get: () => {
                        return currentHitpoints;
                    },
                    set: value => {
                        var change = value - currentHitpoints;
                        currentHitpoints = value;
                        if (this._rules.character.hitpointsChange) {
                            this._rules.character.hitpointsChange(this._game, change);
                        }
                    }
                });
                if (!this._game.character.score) {
                    Object.defineProperty(this._game.character, 'score', {
                        get: () => {
                            return score;
                        },
                        set: value => {
                            var change = value - score;
                            score = value;
                            // Change when xp can be lost.
                            if (change > 0) {
                                var levelUp = this._rules.general && this._rules.general.scoreChange && this._rules.general.scoreChange(this._game, change);
                                if (levelUp) {
                                    this._game.playState = null;
                                    this._game.state = StoryScript.GameState.LevelUp;
                                    this._characterService.setupLevelUp();
                                }
                            }
                        }
                    });
                }
                if (!this._game.state) {
                    Object.defineProperty(this._game, 'state', {
                        get: () => {
                            return gameState;
                        },
                        set: state => {
                            if (state === StoryScript.GameState.GameOver || state === StoryScript.GameState.Victory) {
                                this._game.playState = null;
                                if (this._rules.general && this._rules.general.determineFinalScore) {
                                    this._rules.general.determineFinalScore(this._game);
                                }
                                this.updateHighScore();
                                this._dataService.save(StoryScript.DataKeys.HIGHSCORES, this._game.highScores);
                            }
                            gameState = state;
                        }
                    });
                }
            };
            this.initLogs = () => {
                this._game.actionLog = [];
                this._game.combatLog = [];
                this._game.logToLocationLog = (message) => {
                    this._game.currentLocation.log = this._game.currentLocation.log || [];
                    this._game.currentLocation.log.push(message);
                };
                this._game.logToActionLog = (message) => {
                    this._game.actionLog.splice(0, 0, message);
                };
                this._game.logToCombatLog = (message) => {
                    this._game.combatLog.splice(0, 0, message);
                };
            };
            this.setupCombinations = () => {
                this._game.combinations = {
                    combinationResult: {
                        done: false,
                        text: null,
                        featuresToRemove: [],
                        reset: () => {
                            var result = this._game.combinations.combinationResult;
                            result.done = false;
                            result.text = null;
                            result.featuresToRemove.length = 0;
                        }
                    },
                    activeCombination: null,
                    tryCombine: (target) => {
                        var activeCombo = this._game.combinations.activeCombination;
                        var result = this._combinationService.tryCombination(target);
                        if (result.text) {
                            let featuresToRemove = [];
                            if (result.success) {
                                if (result.removeTarget) {
                                    featuresToRemove.push(target.id);
                                }
                                if (result.removeTool) {
                                    featuresToRemove.push(activeCombo.selectedTool.id);
                                }
                            }
                            this._game.combinations.combinationResult.featuresToRemove = featuresToRemove;
                            return true;
                        }
                        return false;
                    },
                    getCombineClass: (tool) => {
                        return this._combinationService.getCombineClass(tool);
                    }
                };
            };
            this.resetLoadedHtml = (entity) => {
                if (entity === null) {
                    return;
                }
                if (entity.hasHtmlDescription) {
                    if (entity.descriptions) {
                        entity.descriptions = null;
                        entity.text = null;
                    }
                    if (entity.description) {
                        entity.description = null;
                    }
                    if (entity.conversation && entity.conversation.nodes) {
                        entity.conversation.nodes = null;
                    }
                }
                for (var i in Object.keys(entity)) {
                    var key = Object.keys(entity)[i];
                    if (entity.hasOwnProperty(key)) {
                        var nestedEntity = entity[key];
                        if (typeof nestedEntity === 'object') {
                            this.resetLoadedHtml(entity[key]);
                        }
                    }
                }
            };
            this.processMediaTags = (parent, key) => {
                var descriptionEntry = parent;
                var descriptionKey = key;
                // For locations, the descriptions collection must be updated as well as the text.
                if (parent === this._game.currentLocation) {
                    var location = this._game.currentLocation;
                    descriptionEntry = location.descriptions;
                    for (let n in location.descriptions) {
                        if (location.descriptions[n] === location.text) {
                            descriptionKey = n;
                            break;
                        }
                    }
                }
                if (descriptionKey !== key) {
                    this.updateMediaTags(descriptionEntry, descriptionKey, this.mediaTags, '');
                }
                var startPlay = this.updateMediaTags(parent, key, this.mediaTags, 'added="added"');
                if (startPlay) {
                    this.startPlay('audio', parent, key);
                    this.startPlay('video', parent, key);
                }
            };
            this.startPlay = (type, parent, key) => {
                setTimeout(function () {
                    var mediaElements = document.getElementsByTagName(type);
                    for (var i = 0; i < mediaElements.length; i++) {
                        var element = mediaElements[i];
                        var added = element.getAttribute('added');
                        if (element.play && added === 'added') {
                            var loop = element.getAttribute('loop');
                            if (loop != null) {
                                this.updateMediaTags(parent, key, ['added="added"'], 'autoplay');
                            }
                            else {
                                this.updateMediaTags(parent, key, ['added="added"'], '');
                            }
                            // Chrome will block autoplay when the user hasn't interacted with the page yet, use this workaround to bypass that.
                            const playPromise = element.play();
                            if (playPromise !== null) {
                                playPromise.catch(() => {
                                    setTimeout(function () {
                                        element.play();
                                    }, 1000);
                                });
                            }
                        }
                    }
                }, 0);
            };
            this.updateMediaTags = (entity, key, tagToFind, tagToReplace) => {
                let startPlay = false;
                var entry = entity[key];
                if (entry) {
                    for (var i in tagToFind) {
                        var tag = tagToFind[i];
                        if (entry.indexOf(tag) > -1) {
                            entity[key] = entry.replace(tag, tagToReplace);
                            startPlay = true;
                        }
                    }
                }
                return startPlay;
            };
            this.updateHighScore = () => {
                var scoreEntry = { name: this._game.character.name, score: this._game.character.score };
                if (!this._game.highScores || !this._game.highScores.length) {
                    this._game.highScores = [];
                }
                var scoreAdded = false;
                this._game.highScores.forEach((entry) => {
                    if (this._game.character.score > entry.score && !scoreAdded) {
                        var index = this._game.highScores.indexOf(entry);
                        if (this._game.highScores.length >= 5) {
                            this._game.highScores.splice(index, 1, scoreEntry);
                        }
                        else {
                            this._game.highScores.splice(index, 0, scoreEntry);
                        }
                        scoreAdded = true;
                    }
                });
                if (this._game.highScores.length < 5 && !scoreAdded) {
                    this._game.highScores.push(scoreEntry);
                }
                this._dataService.save(StoryScript.DataKeys.HIGHSCORES, this._game.highScores);
            };
        }
    }
    StoryScript.GameService = GameService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    class HelperService {
        constructor(_game) {
            this._game = _game;
            this.randomEnemy = (selector) => StoryScript.random('enemies', this._game.definitions, selector);
            this.randomItem = (selector) => StoryScript.random('items', this._game.definitions, selector);
            this.getItem = (selector) => this.find(selector, 'items', this._game.definitions);
            this.getEnemy = (selector) => this.find(selector, 'enemies', this._game.definitions);
            this.rollDice = (compositeOrSides, dieNumber = 1, bonus = 0) => {
                var sides = compositeOrSides;
                if (typeof compositeOrSides !== 'number') {
                    //'xdy+/-z'
                    var positiveModifier = compositeOrSides.indexOf('+') > -1;
                    var splitResult = compositeOrSides.split('d');
                    dieNumber = parseInt(splitResult[0]);
                    splitResult = (positiveModifier ? splitResult[1].split('+') : splitResult[1].split('-'));
                    splitResult.forEach(e => e.trim());
                    sides = parseInt(splitResult[0]);
                    bonus = parseInt(splitResult[1]);
                    bonus = isNaN(bonus) ? 0 : positiveModifier ? bonus : bonus * -1;
                }
                var result = 0;
                for (var i = 0; i < dieNumber; i++) {
                    result += Math.floor(Math.random() * sides + 1);
                }
                result += bonus;
                return result;
            };
            this.calculateBonus = (person, type) => {
                var bonus = 0;
                if (person[type]) {
                    bonus += person[type];
                }
                if (person.equipment) {
                    for (var n in person.equipment) {
                        var item = person.equipment[n];
                        if (item && item.bonuses && item.bonuses[type]) {
                            bonus += item.bonuses[type];
                        }
                    }
                    ;
                }
                else {
                    if (person.items) {
                        person.items.forEach(item => {
                            if (item && item.bonuses && item.bonuses[type]) {
                                bonus += item.bonuses[type];
                            }
                        });
                    }
                }
                return bonus;
            };
        }
        find(selector, type, definitions) {
            var collection = definitions[type];
            if (!collection && !selector) {
                return null;
            }
            var match = collection.filter((definition) => {
                return StoryScript.compareString(definition.name || definition.originalFunctionName, selector);
            });
            return match[0] ? match[0]() : null;
        }
    }
    StoryScript.HelperService = HelperService;
})(StoryScript || (StoryScript = {}));

var StoryScript;
(function (StoryScript) {
    function SaveWorldState(dataService, locationService, game) {
        dataService.save(StoryScript.DataKeys.CHARACTER, game.character);
        dataService.save(StoryScript.DataKeys.STATISTICS, game.statistics);
        dataService.save(StoryScript.DataKeys.WORLDPROPERTIES, game.worldProperties);
        locationService.saveWorld(game.locations);
    }
    StoryScript.SaveWorldState = SaveWorldState;
})(StoryScript || (StoryScript = {}));

window.StoryScript = StoryScript;

})(window);