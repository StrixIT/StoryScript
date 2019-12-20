import { IQuest as StoryScriptIQuest } from 'storyScript/Interfaces/quest';
import { Quest as StoryScriptQuest } from 'storyScript/ObjectConstructors';

export function Quest(entity: IQuest): IQuest {
    return StoryScriptQuest(entity);
}

export interface IQuest extends StoryScriptIQuest {
    // Add game-specific item properties here
}