module RidderMagnus {
    export class RuleService implements ng.IServiceProvider, StoryScript.IRuleService {
        private game: IGame;

        constructor(game: IGame) {
            var self = this;
            self.game = game;
        }

        public $get(game: IGame): StoryScript.IRuleService {
            var self = this;
            self.game = game;

            return {
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange
            };
        }

        getCreateCharacterSheet = (): StoryScript.ICreateCharacter => {
            return {
                steps: [
                    // Add the character creation steps here.
                    {
                        questions: [
                            {
                                question: 'Voordat je een schildknaap werd, ging je naar:',
                                entries: [
                                    {
                                        text: 'Een militaire school',
                                        value: 'vechten',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Zweinstein',
                                        value: 'toveren',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Geen school, ik leefde op straat',
                                        value: 'zoeken' + 'sluipen',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'Daarna was je 7 jaar de schildknaap van:',
                                entries: [
                                    {
                                        text: 'Gerda de Sterke',
                                        value: 'vechten',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Mihar de Magiër',
                                        value: 'toveren',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Vanja de Vlugge',
                                        value: 'sluipen',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        }

        public createCharacter(characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter {
            var self = this;
            var character = new Character();
            return character;
        }

        fight = (enemyToFight: StoryScript.IEnemy) => {
            var self = this;
            var win = false;

            // Todo: change when multiple enemies of the same type can be present.
            var enemy = self.game.currentLocation.enemies.first(enemyToFight.id);

            // Implement character attack here.

            if (win) {
                return true;
            }

            self.game.currentLocation.enemies.forEach(function (enemy) {
                // Implement monster attack here
            });

            return false;
        }

        hitpointsChange(change: number) {
            var self = this;

            // Implement additional logic to occur when hitpoints are lost. Return true when the character has been defeated.
            return false;
        }

        scoreChange(change: number): boolean {
            var self = this;

            // Implement logic to occur when the score changes. Return true when the character gains a level.
            return false;
        }
    }

    RuleService.$inject = ['game'];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.service("ruleService", RuleService);
}