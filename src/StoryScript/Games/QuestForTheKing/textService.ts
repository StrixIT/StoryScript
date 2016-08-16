module QuestForTheKing {
    export class TextService implements ng.IServiceProvider, StoryScript.ITextService {
        public $get(game: IGame): StoryScript.ITextService {
            var self = this;

            return {
                gameName: 'Quests for the King'                
            };
        }
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
}