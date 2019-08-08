namespace StoryScript {
    var _definitions: IDefinitions = null;
    var _typeNames: string[] = null;
    var _registeredIds: Set<string> = new Set<string>();

    export function Location(entity: ILocation): ILocation {
        var definitions = getDefinitions();
        var location = CreateObject(entity, 'location');

        if (location.destinations) {
            location.destinations.forEach(d => {
                if (d.barrier && d.barrier.key && typeof(d.barrier.key) === 'function') {
                    d.barrier.key = d.barrier.key();
                }
            });
        }

        if (!definitions.dynamicLocations && !location.destinations) {
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

    export function Enemy<T extends IEnemy>(entity: T): T {
        return EnemyBase(entity, 'enemy');
    }

    export function Person<T extends IPerson>(entity: T): T {
        var person = EnemyBase(entity, 'person');
        initCollection(person, 'quests');
        return person;
    }

    export function Item<T extends IItem>(entity: T): T {
        var item = CreateObject(entity, 'item');
        compileCombinations(item);
        return item;
    }

    export function Key<T extends IKey>(entity: T): T {
        return Item(entity);
    }

    export function Feature<T extends IFeature>(entity: T): IFeature {
        var feature = CreateObject(entity, 'feature');
        compileCombinations(feature);
        return feature;
    }

    export function Quest<T extends IQuest>(entity: T): T {
        var item = CreateObject(entity, 'quest');
        return item;
    }

    export function Action(action: IAction): IAction {
        return CreateObject(action, 'action');
    }

    export function setReadOnlyProperties(key: string, data: any) {
        if (key.startsWith(StoryScript.DataKeys.GAME + '_')) {
            data.world.forEach(location => {
                setReadOnlyLocationProperties(location);
            });     
            
            setReadOnlyCharacterProperties(data.character)
        }
        else if (key  === StoryScript.DataKeys.WORLD) {
            data.forEach(location => {
                setReadOnlyLocationProperties(location);
            });     
        }
        else if (key === StoryScript.DataKeys.CHARACTER) {
            setReadOnlyCharacterProperties(data);
        }
    }

    export function initCollection<T>(entity: any, property: string, buildInline?: boolean) {
        const _entityCollections: string[] = [
            'features',
            'items',
            'enemies',
            'persons',
            'quests'
        ];

        const _gameCollections: string[] = _entityCollections.concat([
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
        
        var collection= entity[property] || [];

        if (entity[property] && buildInline) {
            // Initialize any objects that have been declared inline (not a recommended but possible way to declare objects). Check
            // for the existence of an id property to determine whether the object is already initialized.
            collection = (<[]>entity[property]).map((e: { id: string }) => e.id ? e : CreateObject(e, getSingular(property), buildInline));
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

    function setReadOnlyLocationProperties(location: ILocation) {
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

        Object.defineProperty(location, 'activePerson', {
            writable: true,
            enumerable: false
        });

        Object.defineProperty(location, 'activeTrade', {
            writable: true,
            enumerable: false
        });
    }

    function setReadOnlyCharacterProperties(character: ICharacter) {
        Object.defineProperty(character, 'combatItems', {
            get: function () {
                return character.items.filter(e => { return e.useInCombat; });
            }
        });
    }

    function EnemyBase<T extends IEnemy>(entity: T, type: string): T {
        var enemy = CreateObject(entity, type);
        compileCombinations(enemy);
        initCollection(enemy, 'items');
        return enemy;
    }

    function CreateObject<T>(entity: T, type: string, useNameAsId?: boolean)
    {
        var checkType = <{ id: string, type: string}><unknown>entity;

        if (checkType.id || checkType.type) {
            var propertyErrors = checkType.id && checkType.type ? ['id', 'type']
                                    : checkType.id ? ['id'] : ['type'];

            var message = propertyErrors.length > 1 ? "Properties {0} are used by StoryScript. Don't use them on your own types." 
                                                        : "Property {0} is used by StoryScript. Don't use it on your own types.";

            throw new Error(message.replace('{0}', propertyErrors.join(' and ')));
        }

        useNameAsId = useNameAsId === undefined ? false : useNameAsId;
        var compiledEntity: { id: string, name: string, type: string } = typeof entity === 'function' ? entity() : entity;
        var definitions = getDefinitions();
        var types = getTypeNames(definitions);
        var error = new Error();
        var stack = error.stack.split('\n');

        // Skip the stack lines Error, at CreateObject and the first at {type}, e.g. at Item.
        for (var i = 3; i < stack.length; i++) {
            var line = stack[i];
            // Firefox has a different formatting of the stack lines (Journal@[file_and_line]) than Chrome and Edge (at Object.Journal ([file_and_line])).
            var functionName = line.indexOf('@') > -1 ? line.split('@')[0] : line.trim().split(' ')[1];
            functionName = functionName.replace('Object.', '').replace('Array.', '');
            var key = functionName.toLowerCase();
            
            if (types.indexOf(key) < 0) {
                compiledEntity.id = functionName.toLowerCase();
                break;
            }
        }

        if (useNameAsId || !compiledEntity.id) {          
            compiledEntity.id = compiledEntity.name.toLowerCase().replace(/\s/g,'');
        }

        var definitionKeys = getDefinitionKeys(definitions);

        addFunctionIds(compiledEntity, type, definitionKeys);
        var plural = getPlural(type);

        // Add the type to the object so we can distinguish between them in the combine functionality.
        compiledEntity.type = plural;

        if (_registeredIds.has(compiledEntity.id + '_' + compiledEntity.type + '_' +  !useNameAsId)) {
            throw new Error('Duplicate id detected: ' + compiledEntity.id + '. You cannot use names for entities declared inline that are the same as the names of stand-alone entities.');
        }

        _registeredIds.add(compiledEntity.id + '_' + compiledEntity.type + '_' +  useNameAsId);

        var functions = window.StoryScript.ObjectFactory.GetFunctions();

        // If this is the first time an object of this definition is created, get the functions.
        if (!functions[plural] || !Object.getOwnPropertyNames(functions[plural]).find(e => e.startsWith((<any>compiledEntity).id.toLowerCase()))) {
            getFunctions(plural, functions, definitionKeys, compiledEntity, null);
        }

        return <T><unknown>compiledEntity;
    }

    function getDefinitions(): IDefinitions {
        _definitions = _definitions || window.StoryScript.ObjectFactory.GetDefinitions();
        return _definitions;
    }

    function getTypeNames(definitions: IDefinitions): string[] {
        if (_typeNames == null) {
            _typeNames = getDefinitionKeys(definitions);
            _typeNames = _typeNames.concat(['actions', 'keys']);
        }

        return _typeNames.map(t => getSingular(t).toLowerCase());
    }

    function addFunctionIds(entity: any, type: string, definitionKeys: string[], path?: string) {
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
            else if (typeof value === "object") {
                addFunctionIds(entity[key], type, definitionKeys, getPath(value, key, path, definitionKeys));
            }
            else if (typeof value === 'function' && !value.isProxy) {
                var functionId = path ? path + '_' + key : key;
                value.functionId = 'function#' + type + '_' + functionId + '#' + createFunctionHash(value);
            }
        }
    }

    function getPath(value, key: string, path: string, definitionKeys: string[]): string {
        if (definitionKeys.indexOf(key) != -1) {
            path = key;
        }
        else if (definitionKeys.indexOf(path) != -1 && !isNaN(parseInt(key))) {

        }
        else {
            path = path === undefined ? key : path + '_' + key;
        }

        if (value.id) {
            path = path + '_' + value.id;
        }

        return path;
    }

    function compileCombinations(entry: ICombinable) {
        if (entry.combinations) {
            var combines = <ICombine<() => ICombinable>[]>[];
            var failText = entry.combinations.failText;

            entry.combinations.combine.forEach((combine: ICombine<() => ICombinable>) => {
                var compiled = combine;
                compiled.tool = compiled.tool && (<any>compiled.tool).name;
                combines.push(compiled);
            });

            entry.combinations.combine = combines;
            entry.combinations.failText = failText;
            initCollection(entry.combinations, 'combine');
        }
    }

    function pushEntity() {
        var args = [].slice.apply(arguments);
        var originalFunction = args.shift();
        args[0] = typeof args[0] === 'function' ? args[0]() : args[0];
        originalFunction.apply(this, args);
    };

    function getFunctions(type: string, functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, definitionKeys: string[], entity: any, parentId: any) {
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
                return;
            }
            else if (typeof value === "object") {
                getFunctions(type, functionList, definitionKeys, entity[key], entity[key].id ? parentId + '_' + key + '_' + entity[key].id : parentId + '_' + key);
            }
            else if (typeof value == 'function' && !value.isProxy) {
                var functionId = parentId + '_' + key;

                if (!functionList[type]) {
                    functionList[type] = {};
                }

                if (functionList[type][functionId]) {
                    throw new Error('Trying to register a duplicate function key: ' + functionId);
                }

                functionList[type][functionId] = {
                    function: value,
                    hash: createFunctionHash(value)
                }
            }
        }
    }
}