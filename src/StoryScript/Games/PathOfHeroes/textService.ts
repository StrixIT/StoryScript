module PathOfHeroes {
    export class TextService implements ng.IServiceProvider, StoryScript.ITextService {
        public $get(game: IGame): StoryScript.ITextService {
            var self = this;

            return {
            };
        }
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
}