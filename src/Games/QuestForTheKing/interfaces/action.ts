import { IAction as StoryScriptIAction, Action as StoryScriptAction } from 'storyScript/Interfaces/storyScript';

export function Action(action: IAction): IAction {
    return StoryScriptAction(action);
}

export interface IAction extends StoryScriptIAction {
    level?: number;
    activeNight?: boolean;
    activeDay?: boolean;
}