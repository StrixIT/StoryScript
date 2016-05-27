module DangerousCave {
    export class RuleService implements ng.IServiceProvider, StoryScript.Interfaces.IRuleService {
        private game: StoryScript.Game;

        constructor(game: StoryScript.Game) {
            var self = this;
            self.game = game;
        }

        public $get(game: StoryScript.Game): StoryScript.Interfaces.IRuleService {
            var self = this;
            self.game = game;

            return {
                getCharacterForm: self.getCharacterForm,
                createCharacter: self.createCharacter,
                startGame: self.startGame,
                addEnemyToLocation: self.addEnemyToLocation,
                enterLocation: self.enterLocation,
                initCombat: self.initCombat
            };
        }

        public getCharacterForm() {
            return {
                specialties: [
                    {
                        name: 'sterk',
                        value: 'Sterk'
                    },
                    {
                        name: 'snel',
                        value: 'Snel'
                    },
                    {
                        name: 'slim',
                        value: 'Slim'
                    }
                ],
                items: [
                    StoryScript.Items.Dagger(),
                    StoryScript.Items.LeatherHelmet(),
                    StoryScript.Items.Lantern()
                ]
            };
        }

        public createCharacter(characterData: any): StoryScript.Interfaces.ICharacter {
            var self = this;
            var character = new Character();
            character.name = characterData.name;

            switch (characterData.selectedSpecialty.name) {
                case 'sterk': {
                    character.kracht++;
                } break;
                case 'snel': {
                    character.vlugheid++;
                } break;
                case 'slim': {
                    character.oplettendheid++;
                } break;
            }

            character.items.push(characterData.selectedItem);
            return character;
        }

        public startGame() {
            var self = this;
            self.game.changeLocation(self.game.locations.first(StoryScript.Locations.Start));
        }

        public addEnemyToLocation(location: StoryScript.Interfaces.ICompiledLocation, enemy: StoryScript.Interfaces.IEnemy) {
            var self = this;
            self.addFleeAction(location);
        }

        public enterLocation(location: StoryScript.Interfaces.ICompiledLocation): void {
            var self = this;

            self.game.logToActionLog('Je komt aan in ' + location.name);

            if (location.id != 'start' && !location.hasVisited) {
                self.game.character.score += 1;
            }
        }

        public initCombat(location: StoryScript.Interfaces.ICompiledLocation) {
            var self = this;

            // Log the presense of enemies to the action log.
            location.enemies.forEach(function (enemy) {
                self.game.logToActionLog('Er is hier een ' + enemy.name);
            });

            self.addFleeAction(location);
        }

        private addFleeAction(location: StoryScript.Interfaces.ICompiledLocation): void {
            var self = this;
            var numberOfEnemies = location.enemies.length;
            var fleeAction = location.combatActions.first(StoryScript.Actions.Flee);

            if (fleeAction) {
                delete location.combatActions.splice(location.combatActions.indexOf(fleeAction), 1);
            }

            if (numberOfEnemies < (<Character>self.game.character).vlugheid) {
                location.combatActions.push(StoryScript.Actions.Flee(''));
            }
        }
    }

    RuleService.$inject = ['game'];

    var storyScript = angular.module("storyscript");
    storyScript.service("ruleService", RuleService);
}