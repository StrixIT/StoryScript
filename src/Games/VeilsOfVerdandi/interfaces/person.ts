import {IPerson as StoryScriptIPerson, Person as StoryScriptPerson} from 'storyScript/Interfaces/storyScript';
import {IEnemy, IItem} from '../types';
import {IQuest} from 'src/Games/MyAdventureGame/types';

export function Person(entity: IPerson): IPerson {
    return StoryScriptPerson(entity);
}

export interface IPerson extends IEnemy, StoryScriptIPerson {
    items?: IItem[];
    quests?: IQuest[];
    // Add game-specific person properties here
}