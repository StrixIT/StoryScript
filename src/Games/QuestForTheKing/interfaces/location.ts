import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation, ICollection } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem, IPerson, IDestination, IAction } from '../types';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    destinations?: ICollection<IDestination>;
    actions?: ICollection<IAction>;
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    activeEnemies?: ICollection<IEnemy>;
    enemies?: ICollection<IEnemy>;
    activeItems?: ICollection<IItem>;
    items?: ICollection<IItem>;
    activePersons?: ICollection<IPerson>;
    persons?: ICollection<IPerson>;
    activePerson?: IPerson;
    destinations?: ICollection<IDestination>;
    actions?: ICollection<IAction>;
    completedDay?: boolean;
    completedNight?: boolean;
}