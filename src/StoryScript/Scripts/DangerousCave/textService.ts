module DangerousCave {
    export class TextService implements ng.IServiceProvider, StoryScript.Interfaces.ITextService {

        public $get(): StoryScript.Interfaces.ITextService {
            var self = this;

            return {
                createCharacter: self.createCharacter
            };
        }

        public createCharacter(): StoryScript.Interfaces.ICharacter {
            return null;
        }
    }

    //TextService.$inject = [];

    var storyScript = angular.module("storyscript");
    storyScript.service("textService", TextService);
}