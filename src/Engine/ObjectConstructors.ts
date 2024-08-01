import {IDefinitions} from './Interfaces/definitions';
import {ILocation} from './Interfaces/location';
import {IEnemy} from './Interfaces/enemy';
import {IPerson} from './Interfaces/person';
import {IItem} from './Interfaces/item';
import {IKey} from './Interfaces/key';
import {IFeature} from './Interfaces/feature';
import {IQuest} from './Interfaces/quest';
import {IAction} from './Interfaces/action';
import {DataKeys} from './DataKeys';
import {getId, getPlural, getSingular} from './utilities';
import {ICombinable} from './Interfaces/combinations/combinable';
import {ICombine} from './Interfaces/combinations/combine';
import {IEquipment} from './Interfaces/equipment';
import {ActionStatus, ICompiledLocation, IDestination, IParty} from './Interfaces/storyScript';
import {ISaveGame} from './Interfaces/saveGame';
import {Enemies, Features, Items, Locations, Persons, Quests} from "../../constants.ts";

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
    'enterEvents',
    'leaveEvents',
    'trade',
    'destinations',
    'combine'
]);

// The dictionary containing all registered entity keys and their corresponding ids.
let _registeredIds: Map<string, string> = new Map<string, string>();

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

export function GetDefinitions(): IDefinitions {
    return _definitions;
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

export function buildEntities(): void {
    // Build all entities and register them and their ids. The order in which the definitions are read
    // is very important! Entities that can contain other entities should be built AFTER the entities 
    // they may contain. Otherwise, the entity id will not be resolved and actions depending on the id
    // to be present cannot be carried out.
    const allDefinitions = [
        Features,
        Quests,
        Items,
        Enemies,
        Persons,
        Locations
    ];
    
    allDefinitions.forEach(p => {
        _definitions[p].forEach((f: Function) => {
            const compiledEntity = f();
            const entityKey = getEntityKey(compiledEntity);
            compiledEntity.id = getId(f); 
            _registeredIds.set(entityKey, compiledEntity.id);
            loadDependentData(compiledEntity);
            registerEntity(compiledEntity);
        });
    });
}

export function setReadOnlyProperties(key: string, data: any) {
    if (key.startsWith(DataKeys.GAME + '_')) {
        Object.values(data.world).forEach(l => {
            setReadOnlyLocationProperties(<ILocation>l);
        });

        setReadOnlyCharacterProperties((<ISaveGame>data).party)
    } else if (key === DataKeys.WORLD) {
        Object.values(data).forEach(l => {
            setReadOnlyLocationProperties(<ILocation>l);
        });
    } else if (key === DataKeys.PARTY) {
        setReadOnlyCharacterProperties(<IParty>data);
    }
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

export function DynamicEntity<T>(entityFunction: () => T, name: string): T {
    const compiledEntity = entityFunction();
    _registeredIds.set(getEntityKey(<any>compiledEntity), getIdFromName({id: '', name: name})?.toLowerCase());
    return entityFunction();
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

export function setDestination(destination: IDestination) {
    // Set the barrier selected actions to the first one available for each barrier.
    // Further, replace combine functions with their target ids.
    destination.target = getId(destination.target);

    if (destination.barrier) {
        if (destination.barrier.key) {
            const key = destination.barrier.key;
            destination.barrier.key = getId(key);
        }

        if (destination.barrier.combinations?.combine) {
            for (const n in destination.barrier.combinations.combine) {
                const combination = destination.barrier.combinations.combine[n];
                combination.tool = <any>getId(<any>combination.tool);
            }
        }
    }
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
        case 'location':
            return createLocation(entity);
        case 'enemy':
            return EnemyBase(entity, 'enemy', id);
        case 'person':
            return createPerson(entity, id);
        case 'item':
            return createItem(entity, id);
        case 'feature':
            return createFeature(entity, id);
        case 'quest':
            return CreateObject(entity, 'quest', id);
        case 'action':
            return CreateObject(entity, 'action', id);
        case 'trade':
            return CreateObject(entity, 'trade', id);
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

    if (!location.destinations) {
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
    initCollection(location, 'enterEvents');
    initCollection(location, 'leaveEvents');

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

function CreateObject<T>(entity: T, type: string, id?: string) {
    if (typeof entity === 'function') {
        id = getId(entity);
    }

    const compiledEntity = getCompiledEntity(entity, type);
    const entityKey = getEntityKey(compiledEntity);

    checkInlineConflict(id, entityKey);

    if (!id && _registeredIds.has(entityKey)) {
        id = _registeredIds.get(entityKey);
    }
    
    if (id) {
        compiledEntity.id = id;
        loadDependentData(compiledEntity);
    }
    
    return <T><unknown>compiledEntity;
}

function loadDependentData(entity: any) {
    if (entity.description) {
        loadPictureFromDescription(entity, entity.description);
    }
    
    if (entity.type === 'location') {
        setDestinations(entity);
    }
}

function loadPictureFromDescription(entity: any, description: string): void {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(description, 'text/html');
    const pictureElement = htmlDoc.getElementsByClassName('picture')[0];
    const pictureSrc = pictureElement?.getAttribute('src');

    if (pictureSrc) {
        entity.picture = pictureSrc;
    }
}

function setDestinations (location: ICompiledLocation): void {
    if (location.destinations) {
        location.destinations.forEach(destination => {
            setDestination(destination);
        });
    }
}

function initCollection(entity: any, property: string) {
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

    if (typeof entity === 'function') {
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

function getEntityKey(entity: object): string {
    return Object.getOwnPropertyNames(entity).sort((a, b) => a.localeCompare(b)).map(p => {
        const value = entity[p];
        const type = typeof value;
        let text: string;

        if (p === 'description' || Array.isArray(value)) {
            text = undefined;
        } else if (type === 'object') {
            text = p.toString();
        } else if (type === 'function') {
            text = getId(entity[p]);
        } else if (type !== "undefined") {
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
        get: () => filterInactive(location.persons)
    });

    Object.defineProperty(location, 'activeEnemies', {
        get: () => filterInactive(location.enemies)
    });

    Object.defineProperty(location, 'activeItems', {
        get: () => filterInactive(location.items)
    });

    Object.defineProperty(location, 'activeActions', {
        get: function () {
            return location.actions
                .filter(([_, v]) => {
                    return v.status !== ActionStatus.Unavailable && !(<any>v).inactive;
                });
        }
    });
}

function filterInactive(items: any[]) {
    return items.filter(e => {
        return !e.inactive;
    });
}

function setReadOnlyCharacterProperties(party: IParty) {
    party.characters.forEach(c => {
        Object.defineProperty(c, 'combatItems', {
            get: function () {
                const result = c.items.filter(i => {
                    return canUseInCombat(i.useInCombat, i, c.equipment);
                });

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

function getIdFromName<T extends { name: string, id?: string }>(entity: T): string {
    return entity.name.toLowerCase().replace(/\s/g, '');
}