import { IAction } from './interfaces/action';
import { IParty } from './interfaces/party';
import { IDestination } from './interfaces/destination';
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
import { ICombatSetup } from './interfaces/combatRound';
import { IInterfaceTexts } from './interfaces/interfaceTexts';

export type {
    IAction,
    IParty,
    IDestination,
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
    ICombatSetup,
    IInterfaceTexts
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