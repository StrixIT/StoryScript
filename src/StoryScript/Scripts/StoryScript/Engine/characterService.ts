module StoryScript {
    export interface ICharacterService {
        createCharacter(characterData: any): ICharacter;
    }
}

module StoryScript {
    export class CharacterService implements ng.IServiceProvider, ICharacterService {
        private dataService: IDataService;
        private ruleService: IRuleService;

        constructor(dataService: IDataService, ruleService: IRuleService) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
        }

        public $get(dataService: IDataService, ruleService: IRuleService): ICharacterService {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;

            return {
                createCharacter: self.createCharacter
            };
        }

        public createCharacter(characterData: ICreateCharacter): ICharacter {
            var self = this;
            var character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (isEmpty(character)) {

                var self = this;
                character = self.ruleService.createCharacter(characterData);
                character.name = characterData.name;

                characterData.steps.forEach(function (step) {
                    if (step.questions) {
                        step.questions.forEach(function (question) {
                            if (character.hasOwnProperty(question.selectedEntry.value)) {
                                character[question.selectedEntry.value] += question.selectedEntry.bonus;
                            }
                        });
                    }
                });

                characterData.steps.forEach(function (step) {
                    if (step.attributes) {
                        step.attributes.forEach(function (attribute) {
                            if (character.hasOwnProperty(attribute.attribute)) {
                                character[attribute.attribute] = attribute.value;
                            }
                        });
                    }
                });

                return character; 
            }

            if (isEmpty(character.items)) {
                character.items = [];
            }

            return character;
        }
    }

    CharacterService.$inject = ['dataService', 'ruleService'];
}