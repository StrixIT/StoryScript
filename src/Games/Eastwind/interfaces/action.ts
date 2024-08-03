import {Action as StoryScriptAction, IAction} from 'storyScript/Interfaces/storyScript';

export function Action(action: IAction): IAction {
    return StoryScriptAction(action);
}