namespace StoryScript {
    var _definitions: IDefinitions = null;
    var _registeredIds: Set<string> = new Set<string>();
    var _currentEntityId: string = null;

    export function DynamicEntity<T>(entityFunction: () => T, name: string): T {
        var namedFunction = <() => T>createNamedFunction(null, entityFunction, getIdFromName({ id: '', name: name }));
        return CreateEntityProxy(namedFunction)();
    }

    export function CreateEntityProxy<T>(entityFunction: (() => T)): () => T {
        return entityFunction.proxy((originalScope, originalFunc, ...params) => {
            var id = params.splice(params.length - 1, 1)[0];
            var oldId = GetCurrentEntityId();
            SetCurrentEntityId(id);
            var result = originalFunc.apply(originalScope, params);
            SetCurrentEntityId(oldId);
            return result;
        }, entityFunction.name || entityFunction.originalFunctionName);
    }

    export function GetCurrentEntityId() {
        return _currentEntityId;
    }

    export function SetCurrentEntityId(id: string) {
        _currentEntityId = id ? id.toLowerCase() : id;
    }

    export function Location(entity: ILocation): ILocation {
        return Create('location', entity);
    }

    export function Enemy<T extends IEnemy>(entity: T): T {
        return Create('enemy', entity);
    }

    export function Person<T extends IPerson>(entity: T): T {
        return Create('person', entity);
    }

    export function Item<T extends IItem>(entity: T): T {
        return Create('item', entity);
    }

    export function Key<T extends IKey>(entity: T): T {
        return Create('item', entity);
    }

    export function Feature<T extends IFeature>(entity: T): IFeature {
        return Create('feature', entity);
    }

    export function Quest<T extends IQuest>(entity: T): T {
        return Create('quest', entity);
    }

    export function Action(action: IAction): IAction {
        return Create('action', action);
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
            var inlineCollection = (<[]>entity[property]).map((e: { id: string, name: string }) => e.id ? e : Create(getSingular(property), e, getIdFromName(e)));
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

    function Create(type: string, entity: any, id?: string) {
        switch (type) {
            case 'location': {
                return createLocation(entity);
            } break;
            case 'enemy': {
                return EnemyBase(entity, 'enemy', id);
            } break;
            case 'person': {
                return createPerson(entity, id);
            } break;
            case 'item': {
                return createItem(entity, id);
            } break;
            case 'feature': {
                return createFeature(entity, id);
            } break;
            case 'quest': {
                return CreateObject(entity, 'quest', id);
            } break;
            case 'action': {
                return CreateObject(entity, 'action', id);
            }
        }
    }

    function createLocation(entity: ILocation) {
        var location = CreateObject(entity, 'location');

        if (location.destinations) {
            location.destinations.forEach(d => {
                if (d.barrier && d.barrier.key && typeof(d.barrier.key) === 'function') {
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

    function createPerson(entity: IPerson, id?: string) {
        var person = EnemyBase(entity, 'person', id);
        initCollection(person, 'quests');
        return person;
    }

    function createItem(entity: IItem, id?: string) {
        var item = CreateObject(entity, 'item', id);
        compileCombinations(item);
        return item;
    }

    function createFeature(entity: IFeature, id?: string) {
        var feature = CreateObject(entity, 'feature', id);
        compileCombinations(feature);
        return feature;
    }

    function EnemyBase<T extends IEnemy>(entity: T, type: string, id?: string): T {
        var enemy = CreateObject(entity, type, id);
        compileCombinations(enemy);
        initCollection(enemy, 'items');
        return enemy;
    }

    function CreateObject<T>(entity: T, type: string, id?: string)
    {
        var checkType = <{ id: string, type: string}><unknown>entity;

        if (checkType.id || checkType.type) {
            var propertyErrors = checkType.id && checkType.type ? ['id', 'type']
                                    : checkType.id ? ['id'] : ['type'];

            var message = propertyErrors.length > 1 ? 'Properties {0} are used by StoryScript. Don\'t use them on your own types.'
                                                        : 'Property {0} is used by StoryScript. Don\'t use it on your own types.';

            throw new Error(message.replace('{0}', propertyErrors.join(' and ')));
        }

        var compiledEntity: { id: string, name: string, type: string } = typeof entity === 'function' ? entity() : entity;
        var definitions = getDefinitions();
        
        compiledEntity.id = id ? id : GetCurrentEntityId();

        var definitionKeys = getDefinitionKeys(definitions);

        addFunctionIds(compiledEntity, type, definitionKeys);
        var plural = getPlural(type);

        // Add the type to the object so we can distinguish between them in the combine functionality.
        compiledEntity.type = type;

        if (_registeredIds.has(compiledEntity.id + '|' + compiledEntity.type + '|' +  !id)) {
            throw new Error('Duplicate id detected: ' + compiledEntity.id + '. You cannot use names for entities declared inline that are the same as the names of stand-alone entities.');
        }

        _registeredIds.add(compiledEntity.id + '|' + compiledEntity.type);

        var functions = window.StoryScript.ObjectFactory.GetFunctions();

        // If this is the first time an object of this definition is created, get the functions.
        if (!functions[plural] || !Object.getOwnPropertyNames(functions[plural]).find(e => e.startsWith(compiledEntity.id + '|'))) {
            getFunctions(plural, functions, definitionKeys, compiledEntity, null);
        }

        return <T><unknown>compiledEntity;
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

    function getDefinitions(): IDefinitions {
        _definitions = _definitions || window.StoryScript.ObjectFactory.GetDefinitions();
        return _definitions;
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
            else if (typeof value === 'object') {
                addFunctionIds(entity[key], type, definitionKeys, getPath(value, key, path, definitionKeys));
            }
            else if (typeof value === 'function' && !value.isProxy) {
                var functionId = path ? path + '|' + key : key;
                value.functionId = 'function#' + type + '|' + functionId + '#' + createFunctionHash(value);
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
            path = path === undefined ? key : path + '|' + key;
        }

        if (value.id) {
            path = path + '|' + value.id;
        }

        return path;
    }

    function compileCombinations(entry: ICombinable) {
        if (entry.combinations) {
            var combines = <ICombine<() => ICombinable>[]>[];
            var failText = entry.combinations.failText;

            entry.combinations.combine.forEach((combine: ICombine<() => ICombinable>) => {
                var compiled = combine;
                (<any>compiled).tool = compiled.tool && (compiled.tool.name || compiled.tool.originalFunctionName);
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
    };

    function getIdFromName<T extends { name: string, id? : string}>(entity: T): string {
        var id = entity.name.toLowerCase().replace(/\s/g,'');
        return id;
    }

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
                    hash: createFunctionHash(value)
                }
            }
        }
    }
}