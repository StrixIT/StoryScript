import {
    ICompiledLocation as StoryScriptICompiledLocation,
    ILocation as StoryScriptILocation,
    Location as StoryScriptLocation
} from 'storyScript/Interfaces/storyScript';
import {IEnemy, IItem, IPerson} from '../types';

export function Location(entity: ILocation): ILocation {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    // Add game-specific location properties here
    showOnMap?: boolean;
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    activeEnemies?: IEnemy[];
    enemies?: IEnemy[];
    activeItems?: IItem[];
    items?: IItem[];
    activePersons?: IPerson[];
    persons?: IPerson[];
}