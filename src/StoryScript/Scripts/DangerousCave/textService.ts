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

    var storyScript = angular.module("storyscript");
    storyScript.service("textService", TextService);
}