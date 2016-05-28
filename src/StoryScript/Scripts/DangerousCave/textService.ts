module DangerousCave {
    export class TextService implements ng.IServiceProvider, StoryScript.ITextService {

        public $get(): StoryScript.ITextService {
            var self = this;

            return {
                createCharacter: self.createCharacter
            };
        }

        public createCharacter(): StoryScript.ICharacter {
            return null;
        }
    }

    //TextService.$inject = [];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("textService", TextService);
}