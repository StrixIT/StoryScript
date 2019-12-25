import { IAction, Action as StoryScriptAction } from 'storyScript/Interfaces/storyScript';

export function Action(action: IAction): IAction {
    return StoryScriptAction(action);
}