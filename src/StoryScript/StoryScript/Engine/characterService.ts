module StoryScript {
    export interface ICharacterService {
        getSheetAttributes(): string[];
        getCreateCharacterSheet(): ICreateCharacter;
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
                getSheetAttributes: self.getSheetAttributes,
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter
            };
        }

        getSheetAttributes = (): string[] => {
            var self = this;
            return self.ruleService.getSheetAttributes();
        }

        getCreateCharacterSheet = (): ICreateCharacter => {
            var self = this;
            return self.ruleService.getCreateCharacterSheet();
        }

        createCharacter = (characterData: ICreateCharacter): ICharacter => {
            var self = this;
            var character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (isEmpty(character)) {

                var self = this;
                character = self.ruleService.createCharacter(characterData);

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
                            attribute.entries.forEach(function (entry) {
                                if (character.hasOwnProperty(entry.attribute)) {
                                    character[entry.attribute] = entry.value;
                                }
                            });
                        });
                    }
                }); 
            }

            return character;
        }
    }

    CharacterService.$inject = ['dataService', 'ruleService'];
}