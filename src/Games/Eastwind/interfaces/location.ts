import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation, ICollection } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem, IPerson } from '../types';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    // Add game-specific location properties here
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    activeEnemies?: ICollection<IEnemy>;
    enemies?: ICollection<IEnemy>;
    activeItems?: ICollection<IItem>;
    items?: ICollection<IItem>;
    activePersons?: ICollection<IPerson>;
    persons?: ICollection<IPerson>;
}