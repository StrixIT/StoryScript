import { IDefinitions } from './Interfaces/definitions';
import { ILocation } from './Interfaces/location';
import { IEnemy } from './Interfaces/enemy';
import { IPerson } from './Interfaces/person';
import { IItem } from './Interfaces/item';
import { IKey } from './Interfaces/key';
import { IFeature } from './Interfaces/feature';
import { IQuest } from './Interfaces/quest';
import { IAction } from './Interfaces/action';
import { DataKeys } from './DataKeys';
import { getSingular, getPlural } from './utilities';
import { ICharacter } from './Interfaces/character';
import { createFunctionHash } from './globals';
import { ICombinable } from './Interfaces/combinations/combinable';
import { ICombine } from './Interfaces/combinations/combine';

// This flag indicates whether the registration phase is active.
let _registration: boolean = true;

// This string has the key of the current entity being registered.
let _currentEntityKey: string = null;

// The dictionary containing all registered entity keys and their corresponding ids.
let _registeredIds: Map<string, string> = new Map<string, string>();
let _registeredDescriptions: Map<string, string> = new Map<string, string>();

// The object to hold all game entity definitions.
const _definitions: IDefinitions = {
    actions: [],
    locations: [],
    features: [],
    items: [],
    enemies: [],
    persons: [],
    quests: []
};

// The object to hold all game entity functions.
const _functions = {};

export function buildEntities(): void {
    // Build all entities once to register them with their id.
    Object.getOwnPropertyNames(_definitions).forEach(p => {
        _definitions[p].forEach((f: Function) => {
            buildEntity(f, f.name);
        });
    });

    _registration = false;

    // Build all entities again to register their functions.
    Object.getOwnPropertyNames(_definitions).forEach(p => {
        _definitions[p].forEach((f: Function) => {
            f();
        });
    });
}

export function GetDefinitions(): IDefinitions { 
    return _definitions; 
}

export function GetDescriptions(): Map<string, string> { 
    return _registeredDescriptions; 
}

export function GetFunctions(): {} { 
    return _functions; 
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
    if (key.startsWith(DataKeys.GAME + '_')) {
        data.world.forEach(location => {
            setReadOnlyLocationProperties(location);
        });     
        
        setReadOnlyCharacterProperties(data.character)
    }
    else if (key  === DataKeys.WORLD) {
        data.forEach(location => {
            setReadOnlyLocationProperties(location);
        });     
    }
    else if (key === DataKeys.CHARACTER) {
        setReadOnlyCharacterProperties(data);
    }
}

export function initCollection<T>(entity: any, property: string) {
    const _entityCollections: string[] = [
        'features',
        'items',
        'enemies',
        'persons',
        'quests'
    ];

    const _gameCollections: string[] = _entityCollections.concat([
        'trade',
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

    if ((property === 'features' || property === 'trade') && entity[property]) {
        // Initialize features that have been declared inline. Check for the existence of a type property to determine whether the object is already initialized.
        // Store the current entity key, as it will be overridden when inline features are build.
        const locationEntityKey = _currentEntityKey;

        var inlineCollection = (<[]>entity[property]).map((e: { type: string, name: string }) => e.type ? e : Create(getSingular(property), e, getIdFromName(e)));
        collection.length = 0;

        inlineCollection.forEach(e => collection.push(e));

        _currentEntityKey = locationEntityKey;
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

export function Register(type: string, entityFunc: Function): void {
    // Add the entity function to the definitions object for creating entities at run-time.
    _definitions[type] = _definitions[type] || {};

    if (_definitions[type].indexOf(entityFunc) === -1) {
        _definitions[type].push(entityFunc);
    }
}

export function DynamicEntity<T>(entityFunction: () => T, name: string): T {
    // When creating an entity dynamically, make sure we're in registration mode first. Store the
    // old state so normal object creation is not messed up because of dynamic entities created
    // during the normal registration phase.
    var registrationState = _registration;
    _registration = true;

    buildEntity(entityFunction, getIdFromName({ id: '', name: name }));

    _registration = registrationState;

    return entityFunction();
}

function buildEntity(entityFunction: Function, functionName: string) {
    _currentEntityKey = null;

    entityFunction();

    if (_currentEntityKey) {
        // Add the key/id registration record.
        _registeredIds.set(_currentEntityKey, functionName.toLowerCase());
    }
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
        case 'trade': {
            return CreateObject(entity, 'trade', id);
        }
    }
}

function createLocation(entity: ILocation) {
    var location = CreateObject(entity, 'location');

    if (location.destinations) {
        location.destinations.forEach(d => {
            if (d.barrier && d.barrier.key && typeof(d.barrier.key) === 'function') {
                d.barrier.key = d.barrier.key.name;
            }
        });
    }

    if (!location.destinations && _registration) {
        console.log('No destinations specified for location ' + location.name);
    }

    initCollection(location, 'actions');
    initCollection(location, 'combatActions');
    initCollection(location, 'destinations');
    initCollection(location, 'features');
    initCollection(location, 'trade');
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
    var compiledEntity: { id: string, name: string, type: string };
    
    if (typeof entity === 'function') {
        id = entity.name;
        compiledEntity = entity();
    } else {
        compiledEntity = <any>entity;
    }

    if (compiledEntity.id) {
        throw new Error('Property \'id\' is used by StoryScript. Don\'t use it on your own types.');
    }

    if (compiledEntity.type && compiledEntity.type !== type) {
        throw new Error('Property \'type\' is used by StoryScript. Don\'t use it on your own types.');
    }

    // Add the type to the object so we can distinguish between them in the combine functionality.
    compiledEntity.type = type;
    
    var entityKey = getEntityKey(compiledEntity);
    _currentEntityKey = entityKey;

    var inlineConflict = false;

    if (id) {
        _registeredIds.forEach((v, k) => {
            if (v === id && entityKey !== k) {
                inlineConflict = true;
                return;
            }
        });

        if (inlineConflict) {
            throw new Error('Duplicate id detected: ' + compiledEntity.id + '. You cannot use names for entities declared inline that are the same as the names of stand-alone entities.');
        }
    }

    var registeredId = _registeredIds.get(entityKey);

    if (id || registeredId) {
        compiledEntity.id = id || registeredId;
        var descriptionKey = `${compiledEntity.type}_${compiledEntity.id}`;

        if (compiledEntity['description'] && !_registeredDescriptions.get(descriptionKey)) {
            _registeredDescriptions.set(descriptionKey, entity['description'])
        }     
    }

    if (id && !registeredId) {
        _registeredIds.set(entityKey, id);
    }

    if (_registration) {
        return <T><unknown>compiledEntity;
    }

    const definitionKeys = Object.getOwnPropertyNames(_definitions).filter(d => d !== 'actions');

    addFunctionIds(compiledEntity, type, definitionKeys);
    var plural = getPlural(type);

    // If this is the first time an object of this definition is created, get the functions.
    if (!_functions[plural] || !Object.getOwnPropertyNames(_functions[plural]).find(e => e.startsWith(compiledEntity.id + '|'))) {
        getFunctions(plural, _functions, definitionKeys, compiledEntity, null);
    }

    return <T><unknown>compiledEntity;
}

function getEntityKey(entity: object): string {
    return Object.getOwnPropertyNames(entity).sort().map(p => {
        const type = typeof entity[p];
        return type === 'object' || type === 'function' ? 
            p.toString() 
            : type !== "undefined" ? p.toString() + '|' + entity[p].toString() : '';
    }).join('|');
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
}

function setReadOnlyCharacterProperties(character: ICharacter) {
    Object.defineProperty(character, 'combatItems', {
        get: function () {
            var result = character.items.filter(e => { return e.useInCombat; });

            for (var n in character.equipment) {
                var item = <IItem>character.equipment[n];

                if (item?.useInCombat) {
                    if (!item.use) {
                        console.log(`Item ${item.name} declares it can be used in combat but has no use function.`)
                    }

                    result.push(item);
                }
            }

            return result;
        }
    });
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
        var combines = <ICombine<ICombinable>[]>[];
        var failText = entry.combinations.failText;

        entry.combinations.combine.forEach((combine: ICombine<ICombinable>) => {
            var compiled = combine;
            (<any>compiled).tool = compiled.tool && (compiled.tool.name);
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
    parentId = parentId || entity.id;

    if (!parentId) {
        return;
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