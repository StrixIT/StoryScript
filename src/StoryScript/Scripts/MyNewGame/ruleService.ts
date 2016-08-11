module MyNewGame {
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
                    {
                        attributes: [
                            {
                                question: 'What is your name?',
                                entries: [
                                    {
                                        attribute: 'name'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'As a child, you were always...',
                                entries: [
                                    {
                                        text: 'strong in fights',
                                        value: 'strength',
                                        bonus: 1
                                    },
                                    {
                                        text: 'a fast runner',
                                        value: 'agility',
                                        bonus: 1
                                    },
                                    {
                                        text: 'a curious reader',
                                        value: 'intelligence',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'When time came to become an apprentice, you chose to...',
                                entries: [
                                    {
                                        text: 'become a guard',
                                        value: 'strength',
                                        bonus: 1
                                    },
                                    {
                                        text: 'learn about locks',
                                        value: 'agility',
                                        bonus: 1
                                    },
                                    {
                                        text: 'go to magic school',
                                        value: 'intelligence',
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

        fight = (enemy: StoryScript.IEnemy) => {
            var self = this;
            var win = false;
            var damage = self.game.rollDice('1d6') + self.game.character.strength + self.game.calculateBonus(self.game.character, 'damage');
            self.game.logToActionLog('You do ' + damage + ' damage to the ' + enemy.name + '!');

            enemy.hitpoints -= damage;

            if (enemy.hitpoints <= 0) {
                self.game.logToActionLog('You defeat the ' + enemy.name + '!');
                win = true;
            }

            if (win) {
                return true;
            }

            self.game.currentLocation.enemies.forEach(function (enemy) {
                var damage = self.game.rollDice(enemy.attack) + self.game.calculateBonus(<any>enemy, 'damage');
                self.game.logToActionLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                self.game.character.currentHitpoints -= damage;
            });

            return false;
        }

        hitpointsChange(change: number) {
            var self = this;

            // Implement additional logic to occur when hitpoints are lost. Return true when the character has been defeated.
            return self.game.character.currentHitpoints <= 0;
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