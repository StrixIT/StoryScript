import { IDestination, IEnemy, IItem, IPerson } from '../types';
import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation, ICollection } from 'storyScript/Interfaces/storyScript';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    destinations?: ICollection<IDestination>;
    enemies?: ICollection<IEnemy>;
    items?: ICollection<IItem>;
    persons?: ICollection<IPerson>;
    // Add game-specific location properties here
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    destinations?: ICollection<IDestination>;
    enemies?: ICollection<IEnemy>;
    items?: ICollection<IItem>;
    persons?: ICollection<IPerson>;
    // Add game-specific location properties here
}