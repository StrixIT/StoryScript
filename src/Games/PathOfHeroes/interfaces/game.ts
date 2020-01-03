import { IGame as StoryScriptIGame, IHelpers as StoryScriptIHelpers, ICollection } from 'storyScript/Interfaces/storyScript';
import { IPerson, IEnemy, IItem, ICompiledLocation, Character, ILocation } from '../types';

export interface ILocationCollection extends ICollection<ICompiledLocation> {
    get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
}

// Your game-specific game interface.
export interface IGame extends StoryScriptIGame {
    character: Character;
    person: IPerson;
    locations: ILocationCollection;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    helpers: IHelpers;
}

export interface IHelpers extends StoryScriptIHelpers {
    randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
    randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    getEnemy: (selector: string) => IEnemy;
    getItem: (selector: string) => IItem;
}