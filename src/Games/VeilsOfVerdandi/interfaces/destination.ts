import { IDestination as StoryScriptIDestination } from 'storyScript/Interfaces/storyScript';

export interface IDestination extends StoryScriptIDestination {
    activeNight?: boolean;
    activeDay?: boolean;
    hidden?: boolean;
}