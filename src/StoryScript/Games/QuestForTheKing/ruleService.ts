module QuestForTheKing {
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
                                question: 'Do you wish to choose your class manually, or answer questions to determine your path?',
                                entries: [
                                    {
                                        text: 'Choose my class',
                                        value: 'strength',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Answer Questions',
                                        value: 'agility',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'You witness the village bully pestering a little child. Do you:',
                                entries: [
                                    {
                                        text: 'Challenge him to try on someone his own size, namely you?',
                                        value: 'strength',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to sneak up on him and trip him, making him fall into a puddle of mud?',
                                        value: 'agility',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to talk to him and show him the error of his ways?',
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
                                question: 'Your village holds the yearly Harvest Festival, which includes many games. Do you:',
                                entries: [
                                    {
                                        text: 'Participate in the Wrestling contest?',
                                        value: 'strength',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Participate in the Archery contest?',
                                        value: 'agility',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Participate in the Puzzle contest?',
                                        value: 'intelligence',
                                        bonus: 1
                                    },
                                    
                                ]
                            }
                        ]
                    },

                    {
                        questions: [
                            {
                                question: 'You are in love with the most beautiful girl in the village. But you are not the only one. One of your competitors has written a striking poem, and you know the girl loves poetry. Do you:',
                                entries: [
                                    {
                                        text: 'Ignore the poetry and try to impress the girl with a show of strength?',
                                        value: 'strength',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to steal his poem and pass it off as you own?',
                                        value: 'agility',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to write an even better poem?',
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
            var damage = self.game.rollDice('1d6') + self.game.character.strength + self.game.calculateBonus(self.game.character, 'damage');
            self.game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');
            enemy.hitpoints -= damage;

            if (enemy.hitpoints <= 0) {
                self.game.logToCombatLog('You defeat the ' + enemy.name + '!');

                if (!self.game.currentLocation.enemies.some(enemy => enemy.hitpoints > 0)) {
                    self.game.currentLocation.text = self.game.currentLocation.descriptions['after'];
                }
            }

            self.game.currentLocation.enemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                var damage = self.game.rollDice(enemy.attack) + self.game.calculateBonus(<any>enemy, 'damage');
                self.game.logToCombatLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                self.game.character.currentHitpoints -= damage;
            });
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