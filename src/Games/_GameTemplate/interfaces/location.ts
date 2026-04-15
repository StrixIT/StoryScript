import {IDestination, IEnemy, IItem, IPerson} from '../types';
import {
    ICompiledLocation as StoryScriptICompiledLocation,
    ILocation as StoryScriptILocation,
    Location as StoryScriptLocation
} from 'storyScript/Interfaces/storyScript';

export function Location(entity: ILocation): ILocation {
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