import { IDestination, IEnemy, IItem, IPerson } from '../types';
import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation } from 'storyScript/Interfaces/storyScript';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    destinations?: IDestination[];
    enemies?: IEnemy[];
    items?: IItem[];
    persons?: IPerson[];
    // Add game-specific location properties here
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    destinations?: IDestination[];
    enemies?: IEnemy[];
    items?: IItem[];
    persons?: IPerson[];
    // Add game-specific location properties here
}