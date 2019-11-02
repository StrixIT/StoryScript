import StoryScript from '../../../../types/storyscript'

export interface StoryScriptScope extends ng.IScope {
    game: StoryScript.IGame;
}