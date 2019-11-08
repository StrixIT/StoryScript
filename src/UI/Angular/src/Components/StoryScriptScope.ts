import { IGame } from '../../../../Engine/Interfaces/storyScript';

export interface StoryScriptScope extends ng.IScope {
    game: IGame;
}