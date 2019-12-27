import { ILocation as StoryScriptILocation, Location as StoryScriptLocation, ICompiledLocation as StoryScriptICompiledLocation, ICollection } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem, IPerson, IDestination } from '../types';

export function Location(entity: ILocation): ILocation  {
    return StoryScriptLocation(entity);
}

export interface ILocation extends StoryScriptILocation {
    destinations?: ICollection<IDestination>;
}

export interface ICompiledLocation extends ILocation, StoryScriptICompiledLocation {
    activeEnemies?: ICollection<IEnemy>;
    enemies?: ICollection<IEnemy>;
    activeItems?: ICollection<IItem>;
    items?: ICollection<IItem>;
    activePersons?: ICollection<IPerson>;
    persons?: ICollection<IPerson>;
    activePerson: IPerson;
    destinations?: ICollection<IDestination>;
    completedDay?: boolean;
    completedNight?: boolean;
}