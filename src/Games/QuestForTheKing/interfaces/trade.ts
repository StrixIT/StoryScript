import { ITrade as StoryScriptTrade } from 'storyScript/Interfaces/storyScript';

export interface ITrade extends StoryScriptTrade {
    currentDay?: number;
}