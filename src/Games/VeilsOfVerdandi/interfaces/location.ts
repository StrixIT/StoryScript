import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation, ICollection } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem, IPerson, IDestination, IAction, IGame } from '../types';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    actions?: [string, IAction][];
    destinations?: ICollection<IDestination>;
    enemies?: ICollection<IEnemy>;
    items?: ICollection<IItem>;
    persons?: ICollection<IPerson>;
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    actions?: [string, IAction][];
    destinations?: ICollection<IDestination>;
    enemies?: ICollection<IEnemy>;
    items?: ICollection<IItem>;
    persons?: ICollection<IPerson>;
    completedDay?: boolean;
    completedNight?: boolean;
}