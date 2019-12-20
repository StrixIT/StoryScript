import { IAction } from 'storyScript/Interfaces/action';
import { Action as StoryScriptAction } from 'storyScript/ObjectConstructors';

export function Action(action: IAction): IAction {
    return StoryScriptAction(action);
}