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
import { getSingular, getPlural, getId } from './utilities';
import { ICombinable } from './Interfaces/combinations/combinable';
import { ICombine } from './Interfaces/combinations/combine';
import { IEquipment } from './Interfaces/equipment';
import { ActionStatus, IParty } from './Interfaces/storyScript';
import { ISaveGame } from './Interfaces/saveGame';
import {FunctionType} from "../../constants.ts";

const _entityCollections: string[] = [
    'features',
    'items',
    'enemies',
    'persons',
    'quests'
];

// The dictionary containing all registered entity keys and their corresponding ids.
let _registeredIds: Map<string, string> = new Map<string, string>();

// The dictionary containing all registered entity ids and their corresponding descriptions.
let _registeredDescriptions: Map<string, string> = new Map<string, string>();

// A record to keep all the entities available, fully build.
const _registeredEntities: Record<string, Record<string, any>> = {};

// The object to hold all game entity definitions.
let _definitions: IDefinitions = {
    actions: [],
    locations: [],
    features: [],
    items: [],
    enemies: [],
    persons: [],
    quests: []
};

let registration = true;

export function buildEntities(): void {
    const allDefinitions = Object.getOwnPropertyNames(_definitions);
    
    // Build all entities once to determine their id.
    allDefinitions.forEach(p => {
        _definitions[p].forEach((f: Function) => {
            const compiledEntity = f();
            _registeredIds.set(getEntityKey(compiledEntity), getId(f));
        });
    });

    registration = false;

    // Build all entities again to add ids to nested entities.
    allDefinitions.forEach(p => {
        _definitions[p].forEach((f: Function) => {
            registerEntity(f());
        });
    });
}

export function GetDefinitions(): IDefinitions { 
    return _definitions; 
}

export function GetDescriptions(): Map<string, string> { 
    return _registeredDescriptions; 
}

export function GetRegisteredEntities() { 
    return _registeredEntities; 
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
        data.world.forEach((location: ILocation) => {
            setReadOnlyLocationProperties(location);
        });     
        
        setReadOnlyCharacterProperties((<ISaveGame>data).party)
    }
    else if (key  === DataKeys.WORLD) {
        data.forEach((location: ILocation) => {
            setReadOnlyLocationProperties(location);
        });     
    }
    else if (key === DataKeys.PARTY) {
        setReadOnlyCharacterProperties(<IParty>data);
    }
}

export function initCollection(entity: any, property: string) {
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
    
    const collection = entity[property] || [];

    if ((property === 'features' || property === 'trade') && collection.length) {
        const inlineCollection = collection.map((e: { type: string, name: string }) => {
            // Initialize features that have been declared inline. Check for the existence of a 
            // type property to determine whether the object is already initialized.
            if (e.type) {
                return e;
            }

            const typeName = getSingular(property);
            return Create(typeName, e, getIdFromName(e));
        });

        collection.length = 0;

        inlineCollection.forEach((e: any) => {
            collection.push(e);
            
            if (e.id) {
                registerEntity(e);
            }
        });
    }

    InitEntityCollection(entity, property);
}

export function Register(type: string, entityFunc: Function, testDefinitions?: IDefinitions): IDefinitions {
    const definitions = testDefinitions ?? _definitions;

    // Add the entity function to the definitions object for creating entities at run-time.
    definitions[type] = definitions[type] || {};

    if (definitions[type].indexOf(entityFunc) === -1) {
        definitions[type].push(entityFunc);
    }

    return definitions;
}

export function InitEntityCollection(entity: any, property: string) {
    const collection = entity[property] || [];

    Object.defineProperty(entity, property, {
        enumerable: true,
        get: function () {
            return collection;
        },
        set: function () {
            const message = entity.type ? `Cannot set collection ${property} on type ${entity.type}!` : `Cannot set collection ${property}!`;
            throw new Error(message);
        }
    });

    if (_entityCollections.indexOf(property) > -1) {
        Object.defineProperty(collection, 'add', {
            writable: true,
            value: collection.add.proxy(pushEntity)
        });
    }
}

export function DynamicEntity<T>(entityFunction: () => T, name: string): T {
    const compiledEntity = entityFunction();
    _registeredIds.set(getEntityKey(<any>compiledEntity), getIdFromName({ id: '', name: name })?.toLowerCase());
    return entityFunction();
}

function registerEntity(entity: any): void {
    const type = getPlural(entity.type);
    _registeredEntities[type] ??= {};

    if (!_registeredEntities[type][entity.id]) {
        _registeredEntities[type][entity.id] = entity;
    } 
}

function Create(type: string, entity: any, id?: string) {
    switch (type) {
        case 'location': return createLocation(entity);
        case 'enemy': return EnemyBase(entity, 'enemy', id);
        case 'person': return createPerson(entity, id);
        case 'item': return createItem(entity, id);
        case 'feature': return createFeature(entity, id);
        case 'quest': return CreateObject(entity, 'quest', id);
        case 'action': return CreateObject(entity, 'action', id);
        case 'trade': return CreateObject(entity, 'trade', id);
    }
}

function createLocation(entity: ILocation) {
    const location = CreateObject(entity, 'location');

    if (location.destinations) {
        location.destinations.forEach(d => {
            if (d.barrier?.key) {
                d.barrier.key = getId(d.barrier.key);
            }
            
            d.target = getId(d.target);
        });
    }

    if (!location.destinations && registration) {
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
    const person = EnemyBase(entity, 'person', id);
    initCollection(person, 'quests');
    return person;
}

function createItem(entity: IItem, id?: string) {
    const item = CreateObject(entity, 'item', id);
    compileCombinations(item);
    return item;
}

function createFeature(entity: IFeature, id?: string) {
    const feature = CreateObject(entity, 'feature', id);
    compileCombinations(feature);
    return feature;
}

function EnemyBase<T extends IEnemy>(entity: T, type: string, id?: string): T {
    const enemy = CreateObject(entity, type, id);
    compileCombinations(enemy);
    initCollection(enemy, 'items');
    return enemy;
}

function CreateObject<T>(entity: T, type: string, id?: string)
{
    if (typeof entity === FunctionType) {
        id = getId(<Function>entity);
    }
    
    const compiledEntity = getCompiledEntity(entity, type);
    const entityKey = getEntityKey(compiledEntity);
    checkInlineConflict(id, entityKey);
    const registeredId = _registeredIds.get(entityKey);

    if (id && !registeredId) {
        _registeredIds.set(entityKey, id);
    }

    if (id || registeredId) {
        compiledEntity.id = id || registeredId;
        const descriptionKey = `${compiledEntity.type}_${compiledEntity.id}`;

        if (compiledEntity.description) {
            loadPictureFromDescription(compiledEntity, compiledEntity.description);
            
            if (!_registeredDescriptions.get(descriptionKey)) {
                _registeredDescriptions.set(descriptionKey, compiledEntity.description);
            }
        }     
    }
    
    return <T><unknown>compiledEntity;
}

function checkInlineConflict(id: string, entityKey: string) {
    let inlineConflict = false;

    if (id) {
        _registeredIds.forEach((v, k) => {
            if (v === id && entityKey !== k) {
                inlineConflict = true;
            }
        });

        if (inlineConflict) {
            throw new Error('Duplicate id detected: ' + id + '. You cannot use names for entities declared inline that are the same as the names of stand-alone entities.');
        }
    }
}

function getCompiledEntity(entity: any, type: string): { id: string, type: string, description?: string } {
    let compiledEntity: { id: string, type: string };

    if (typeof entity === FunctionType) {
        compiledEntity = entity();
    } else {
        compiledEntity = entity;
    }

    if (compiledEntity.id) {
        throw new Error('Property \'id\' is used by StoryScript. Don\'t use it on your own types.');
    }

    if (compiledEntity.type && compiledEntity.type !== type) {
        throw new Error('Property \'type\' is used by StoryScript. Don\'t use it on your own types.');
    }

    // Add the type to the object, so we can distinguish between them in the combine functionality.
    compiledEntity.type = type;
    return compiledEntity;
}

function loadPictureFromDescription (entity: any, description: string): void {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(description, 'text/html');
    const pictureElement = htmlDoc.getElementsByClassName('picture')[0];
    const pictureSrc = pictureElement?.getAttribute('src');

    if (pictureSrc) {
        entity.picture = pictureSrc;
    }
}

function getEntityKey(entity: object): string {
    return Object.getOwnPropertyNames(entity).sort((a, b) => a.localeCompare(b)).map(p => {
        const value = entity[p];
        const type = typeof value;
        let text: string;
        
        if (p === 'description' || Array.isArray(value)) {
            text = undefined;
        } 
        else if (type === 'object') {
            text = p.toString();
        } 
        else if (type === 'function') {
            text =  getId(entity[p]);
        }
        else if (type !== "undefined") {
            text = p.toString() + '|' + entity[p].toString();
        }
        
        return text;
    }).filter(e => e).join('|');
}

function setReadOnlyLocationProperties(location: ILocation) {
    // If the location already has the active collections, we don't need to do anything else.
    if ((<any>location).activePersons) {
        return;
    }

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

    Object.defineProperty(location, 'activeActions', {
        get: function () {
            return location.actions
                .filter(([_, v]) => { return v.status !== ActionStatus.Unavailable; })
                .map(([k, v]) => {
                    v.id = k;
                    return v;
                });
        }
    });
}

function setReadOnlyCharacterProperties(party: IParty) {
    party.characters.forEach(c => {
        Object.defineProperty(c, 'combatItems', {
            get: function () {
                const result = c.items.filter(i => { return canUseInCombat(i.useInCombat, i, c.equipment); });

                for (const n in c.equipment) {
                    const item = <IItem>c.equipment[n];

                    if (item && canUseInCombat(item.useInCombat, item, c.equipment)) {
                        result.push(item);
                    }
                }

                return result;
            }
        });
    });
}

function canUseInCombat(flagOrFunction: boolean | ((item: IItem, equipment: IEquipment) => boolean), item: IItem, equipment: {}) {
    const canUse = (typeof flagOrFunction === "function") ? flagOrFunction(item, equipment) : flagOrFunction;

    if (canUse && !item.use) {
        console.log(`Item ${item.name} declares it can be used in combat but has no use function.`)
    }

    return canUse;
}


function compileCombinations(entry: ICombinable) {
    if (entry.combinations) {
        const combines = <ICombine<ICombinable>[]>[];
        const failText = entry.combinations.failText;

        entry.combinations.combine.forEach((combine: ICombine<ICombinable>) => {
            const compiled = combine;
            (<any>compiled).tool = compiled.tool?.name;
            combines.push(compiled);
        });

        entry.combinations.combine = combines;
        entry.combinations.failText = failText;
        initCollection(entry.combinations, 'combine');
    }
}

function pushEntity(originalScope: any, originalFunction: any, entity: any) {
    entity = typeof entity === 'function' ? entity() : entity;

    if (!entity.id && entity.name) {
        entity.id = getIdFromName(entity);
    }

    originalFunction.apply(originalScope, [entity]);
}

function getIdFromName<T extends { name: string, id? : string}>(entity: T): string {
    return entity.name.toLowerCase().replace(/\s/g,'');
}