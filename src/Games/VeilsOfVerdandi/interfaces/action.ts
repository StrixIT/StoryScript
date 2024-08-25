import {IAction as StoryScriptIAction} from 'storyScript/Interfaces/storyScript';

export interface IAction extends StoryScriptIAction {
    level?: number;
    activeNight?: boolean;
    activeDay?: boolean;
}