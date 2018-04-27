namespace StoryScript {
    export interface ICharacterService {
        getSheetAttributes(): string[];
        getCreateCharacterSheet(): ICreateCharacter;
        createCharacter(game: IGame, characterData: any): ICharacter;
    }
}

namespace StoryScript {
    export class CharacterService implements ng.IServiceProvider, ICharacterService {
        private dataService: IDataService;
        private rules: IRules;

        constructor(dataService: IDataService, rules: IRules) {
            var self = this;
            self.dataService = dataService;
            self.rules = rules;
        }

        public $get(dataService: IDataService, rules: IRules): ICharacterService {
            var self = this;
            self.dataService = dataService;
            self.rules = rules;

            return {
                getSheetAttributes: self.getSheetAttributes,
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter
            };
        }

        getSheetAttributes = (): string[] => {
            var self = this;
            return self.rules.getSheetAttributes();
        }

        getCreateCharacterSheet = (): ICreateCharacter => {
            var self = this;
            return self.rules.getCreateCharacterSheet();
        }

        createCharacter = (game: IGame, characterData: ICreateCharacter): ICharacter => {
            var self = this;
            var character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (isEmpty(character)) {

                var self = this;
                character = self.rules.createCharacter(game, characterData);

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

    CharacterService.$inject = ['dataService', 'rules'];
}