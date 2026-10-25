import { IQuest as StoryScriptIQuest, Quest as StoryScriptQuest } from 'storyScript';

export function Quest(entity: IQuest): IQuest {
    return StoryScriptQuest(entity);
}

export interface IQuest extends StoryScriptIQuest {
    // Add game-specific item properties here
}