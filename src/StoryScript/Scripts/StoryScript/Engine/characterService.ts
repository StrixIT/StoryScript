module StoryScript.Interfaces {
    export interface ICharacterService {
        createCharacter(characterData: any): ICharacter;
    }
}

module StoryScript {
    export class CharacterService implements ng.IServiceProvider, Interfaces.ICharacterService {
        private dataService: Interfaces.IDataService;
        private ruleService: Interfaces.IRuleService;

        constructor(dataService: Interfaces.IDataService, ruleService: Interfaces.IRuleService) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
        }

        public $get(dataService: Interfaces.IDataService, ruleService: Interfaces.IRuleService): Interfaces.ICharacterService {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;

            return {
                createCharacter: self.createCharacter
            };
        }

        public createCharacter(characterData: any): Interfaces.ICharacter {
            var self = this;
            var character = self.dataService.load<Interfaces.ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (isEmpty(character)) {
                character = self.ruleService.createCharacter(characterData);
            }

            if (isEmpty(character.items)) {
                character.items = [];
            }

            return character;
        }
    }

    CharacterService.$inject = ['dataService', 'ruleService'];
}