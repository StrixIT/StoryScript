module PathOfHeroes {
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
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange
            };
        }

        getSheetAttributes = () => {
            return [
                'currency',
                'strength',
                'melee',
                'armor',
                'agility',
                'ranged',
                'stealth',
                'intelligence',
                'creation',
                'destruction',
                'charisma',
                'body',
                'spirit'
            ];
        }

        getCreateCharacterSheet = (): StoryScript.ICreateCharacter => {
            return {
                steps: [
                    {
                        questions: [
                            {
                                question: 'Do you want to start play...',
                                entries: [
                                    {
                                        text: 'Right away',
                                        value: '1'
                                    },
                                    {
                                        text: 'After telling your story',
                                        value: '2'
                                    },
                                    {
                                        text: 'By fine-tuning your sheet',
                                        value: '3'
                                    }
                                ]
                            }
                        ],
                        nextStepSelector: (character, currentStep) => {
                            switch (currentStep.questions[0].selectedEntry.value) {
                                case '1': {
                                    return 1;
                                };
                                case '2': {
                                    return 2;
                                };
                                case '3': {
                                    return 3;
                                };
                            }
                        }
                    },
                    {
                        questions: [
                            {
                                question: 'Select your hero',
                                entries: [
                                    {
                                        text: 'Barlon the Oak',
                                        value: 'barlon',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Stella the Quick',
                                        value: 'stella',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Jane Orion',
                                        value: 'jane',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Marlin Peacemaker',
                                        value: 'marlin',
                                        bonus: 1
                                    }
                                ]
                            }
                        ],
                        nextStepSelector: 4
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
                        ],
                        nextStepSelector: 4
                    },
                    {
                        attributes: [
                            {
                                question: 'As a child, you were always...',
                                entries: [
                                    {
                                        attribute: 'strength',
                                        max: 5,
                                        min: 1
                                    },
                                    {
                                        attribute: 'agility',
                                        max: 5,
                                        min: 1
                                    },
                                    {
                                        attribute: 'intelligence',
                                        max: 5,
                                        min: 1
                                    },
                                    {
                                        attribute: 'charisma',
                                        max: 5,
                                        min: 1
                                    }
                                ]
                            }
                        ],
                        nextStepSelector: 4
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

            // Implement character attack here.

            self.game.currentLocation.enemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                // Implement monster attack here
            });
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
}