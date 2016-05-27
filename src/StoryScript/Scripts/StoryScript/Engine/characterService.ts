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

        public createCharacter(characterData: any): ICharacter {
            var self = this;
            var character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

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