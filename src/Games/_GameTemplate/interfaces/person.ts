import { ICollection, IPerson as StoryScriptIPerson, Person as StoryScriptPerson } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem, IQuest } from '../types';

export function Person(entity: IPerson): IPerson {
    return StoryScriptPerson(entity);
}

export interface IPerson extends IEnemy, StoryScriptIPerson {
    items?: ICollection<IItem>;
    quests?: ICollection<IQuest>;
}