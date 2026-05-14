import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem, IPerson } from '../types';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    // Add game-specific location properties here
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    enemies?: IEnemy[];
    items?: IItem[];
    persons?: IPerson[];
}