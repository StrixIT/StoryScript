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
                getSheetAttributes: self.getSheetAttributes,
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                fight: self.fight,
                scoreChange: self.scoreChange
            };
        }

        getSheetAttributes = () => {
            return [
                'strength',
                'agility',
                'intelligence'
            ]
        };

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

        fight = (enemy: ICompiledEnemy) => {
            var self = this;
            var damage = StoryScript.Functions.rollDice('1d6') + self.game.character.strength + StoryScript.Functions.calculateBonus(self.game.character, 'damage');
            self.game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');
            enemy.hitpoints -= damage;

            if (enemy.hitpoints <= 0) {
                self.game.logToCombatLog('You defeat the ' + enemy.name + '!');
            }

            self.game.currentLocation.activeEnemies.filter((enemy: ICompiledEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                var damage = StoryScript.Functions.rollDice(enemy.attack) + StoryScript.Functions.calculateBonus(enemy, 'damage');
                self.game.logToCombatLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                self.game.character.currentHitpoints -= damage;
            });
        }

        scoreChange(change: number): boolean {
            var self = this;

            // Implement logic to occur when the score changes. Return true when the character gains a level.
            return false;
        }
    }

    RuleService.$inject = ['game'];
}