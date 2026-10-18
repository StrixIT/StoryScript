import { IParty as StoryScriptIParty } from 'storyScript';
import { Character, IQuest } from '../types';


export interface IParty extends StoryScriptIParty {
    characters: Character[];
    quests?: IQuest[];
}