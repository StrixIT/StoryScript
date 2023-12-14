import { IGame as StoryScriptIGame, IHelpers as StoryScriptIHelpers, ICollection } from 'storyScript/Interfaces/storyScript';
import { IPerson, IEnemy, IItem, ICompiledLocation, Character, ILocation } from '../types';
import { IWorldProperties } from './worldProperties';

export interface ILocationCollection extends ICollection<ICompiledLocation> {
    get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
}

// Your game-specific game interface.
export interface IGame extends StoryScriptIGame {
    character: Character;
    locations: ILocationCollection;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
    worldProperties: IWorldProperties;
}