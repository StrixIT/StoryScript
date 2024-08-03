import {ICollection, IParty as StoryScriptIParty} from 'storyScript/Interfaces/storyScript';
import {Character, IQuest} from '../types';


export interface IParty extends StoryScriptIParty {
    characters: Character[];
    quests?: ICollection<IQuest>;
}