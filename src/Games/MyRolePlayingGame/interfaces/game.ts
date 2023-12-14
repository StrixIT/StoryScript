import { IGame as StoryScriptIGame, ICollection } from 'storyScript/Interfaces/storyScript';
import { ICompiledLocation, IPerson, Character, ILocation } from '../types';

export interface ILocationCollection extends ICollection<ICompiledLocation> {
    get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
}

export interface IGame extends StoryScriptIGame {
    character: Character;
    person: IPerson;
    locations: ILocationCollection;
    currentLocation: ICompiledLocation;
    previousLocation: ICompiledLocation;
}