import { IFeature, Feature } from './interfaces/feature';
import { IItem, Item } from './interfaces/item';
import { IKey, Key } from './interfaces/key';
import { IEnemy, Enemy } from './interfaces/enemy';
import { IPerson, Person } from './interfaces/person';
import { IQuest, Quest } from './interfaces/quest';
import { ICompiledLocation, ILocation, Location } from './interfaces/location';
import { IEquipment } from './interfaces/equipment';
import { IGame } from './interfaces/game';
import { CustomTexts } from './customTexts';
import { Rules } from './rules';
import { Character } from './character';

export type {
    IFeature,
    IItem,
    IKey,
    IEnemy,
    IPerson,
    IQuest,
    ILocation,
    ICompiledLocation, 
    IEquipment,
    IGame, 
}

export { 
    Feature,
    Item,
    Key,
    Enemy,
    Person,
    Quest,
    Location, 
    CustomTexts, 
    Rules, 
    Character 
}