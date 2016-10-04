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
                getSheetAttributes: self.getSheetAttributes,
                getCreateCharacterSheet: self.getCreateCharacterSheet,
                createCharacter: self.createCharacter,
                fight: self.fight,
                hitpointsChange: self.hitpointsChange,
                scoreChange: self.scoreChange,
                setupGame: self.setupGame,
                enterLocation: self.enterLocation
            };
        }

        getSheetAttributes = () => {
            return [
                'strength',
                'agility',
                'intelligence',
                'charisma',
            ];
        }

        setupGame = (game: IGame) => {
            game.worldProperties = {
                currentDay: 0,
                isDay: true,
                isNight: false
            }
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
                                        value: '2'
                                    },
                                    {
                                        text: 'Answer Questions',
                                        value: '3'
                                    }
                                ]
                            }
                        ],
                        nextStepSelector: (character, currentStep) => {
                            switch (currentStep.questions[0].selectedEntry.value) {
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
                                question: 'Choose your class',
                                entries: [
                                    {
                                        text: 'Rogue',
                                        value: 'rogue'
                                    },
                                    {
                                        text: 'Warrior',
                                        value: 'warrior'
                                    },
                                    {
                                        text: 'Wizard',
                                        value: 'wizard'
                                    }
                                ]
                            }
                        ],
                        nextStepSelector: 9
                    },
                    {
                        questions: [
                            {
                                question: 'You witness the village bully pestering a little child. Do you:',
                                entries: [
                                    {
                                        text: 'Challenge him to try on someone his own size, namely you?',
                                        value: 'warrior',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to sneak up on him and trip him, making him fall into a puddle of mud?',
                                        value: 'rogue',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to talk to him and show him the error of his ways?',
                                        value: 'wizard',
                                        bonus: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'Your grandfather has been telling you stories of the gods of the old homeland. Stories of the mighty Thor, the wise Odin and the clever Loki. He promises to teach you a prayer to one of the gods to invoke his blessing. Which god do you choose?',
                                entries: [
                                    {
                                        text: 'Thor, the god of storms and lightning, the destroyer of giants.',
                                        value: 'warrior',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Loki, the god of trickery and deceit, the troublemaker.',
                                        value: 'rogue',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Odin, the god of wisdom and insight, the Allfather.',
                                        value: 'wizard',
                                        bonus: 1
                                    },

                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'A wolf has been ravaging the flocks of sheep of your village. Do you:',
                                entries: [
                                    {
                                        text: 'Go out and hunt the beast?',
                                        value: 'warrior',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Set a devious trap?',
                                        value: 'rogue',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Design and build a new fence to keep the wolf and future predators out?',
                                        value: 'wizard',
                                        bonus: 1
                                    },

                                ]
                            }
                        ]
                    },
                    
                    {
                        questions: [
                            {
                                question: 'Your village holds the yearly Harvest festival, which has many games. Do you:',
                                entries: [
                                    {
                                        text: 'Participate in the Wrestling contest? ',
                                        value: 'warrior',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Participate in the Archery contest?',
                                        value: 'rogue',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Participate in the Puzzle contest?',
                                        value: 'wizard',
                                        bonus: 1
                                    },

                                ]
                            }
                        ]
                    },
                    {
                        questions: [
                            {
                                question: 'An item of great importance to your village has been stolen from the house of the mayor. The local magistrate has identified several suspects, but his questioning so far has led to no results. You think you could do better, and if it where up to you, would you:',
                                entries: [
                                    {
                                        text: 'Use strength and intimidation to get some answers.',
                                        value: 'warrior',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Use stealth to follow the movements of the suspects, and agility to enter their houses undetected and search for clues.',
                                        value: 'rogue',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Use deduction and reasoning to get to the truth.',
                                        value: 'wizard',
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
                                        value: 'warrior',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to steal his poem and pass it off as you own?',
                                        value: 'rogue',
                                        bonus: 1
                                    },
                                    {
                                        text: 'Try to write an even better poem?',
                                        value: 'wizard',
                                        bonus: 1
                                    }
                                ]
                            }
                        ],
                        nextStepSelector: 9
                    },
                    {
                        initStep: (character, previousStep, currentStep) => {
                            var characterClass = character.steps[2].questions[0].selectedEntry.value;
                            var points = {
                                warrior: 0,
                                rogue: 0,
                                wizard: 0
                            };

                            // If questions were answered, calculate which class has the highest score.
                            if (previousStep > 2) {
                                for (var i = 3; i <= previousStep; i++) {
                                    var selectedEntry = character.steps[i].questions[0].selectedEntry;
                                    points[selectedEntry.value] += selectedEntry.bonus;
                                }

                                // When the scores are equal, the first class in the list wins (first warrior, then rogue, then wizard).
                                var max = Math.max(points.warrior, points.rogue, points.wizard);
                                characterClass = max === points.warrior ? 'warrior' : max === points.rogue ? 'rogue' : 'wizard';
                            }

                            // Set the items to chose from.
                            switch (characterClass) {
                                case 'warrior': {
                                    currentStep.questions[0].entries = [
                                        {
                                            text: Items.LongSword().name,
                                            value: (<any>Items.LongSword).name
                                        },
                                        {
                                            text: Items.Battleaxe().name,
                                            value: (<any>Items.Battleaxe).name
                                        },
                                        {
                                            text: Items.Warhammer().name,
                                            value: (<any>Items.Warhammer).name
                                        }
                                    ];
                                }; break;
                                case 'rogue': {
                                    currentStep.questions[0].entries = [
                                        {
                                            text: Items.Dagger().name,
                                            value: (<any>Items.Dagger).name
                                        },
                                        {
                                            text: Items.Rapier().name,
                                            value: (<any>Items.Rapier).name
                                        },
                                        {
                                            text: Items.Shortsword().name,
                                            value: (<any>Items.Shortsword).name
                                        }
                                    ];
                                }; break;
                                case 'wizard': {
                                    currentStep.questions[0].entries = [
                                        {
                                            text: Items.Fireball().name,
                                            value: (<any>Items.Fireball).name
                                        },
                                        {
                                            text: Items.Frostbite().name,
                                            value: (<any>Items.Frostbite).name
                                        },
                                        {
                                            text: Items.Shockbolt().name,
                                            value: (<any>Items.Shockbolt).name
                                        }
                                    ];
                                }; break;
                            }

                            // Update the class selector step to use when processing the character sheet data.
                            character.steps[2].questions[0].selectedEntry = character.steps[2].questions[0].entries.filter(entry => entry.value === characterClass)[0];
                        },
                        questions: [
                            {
                                question: 'Select your weapon',
                                entries: [
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

            var characterClass = characterData.steps[2].questions[0].selectedEntry.value;

            switch (characterClass) {
                case 'warrior': {
                    character.strength = 3;
                    character.agility = 1;
                    character.intelligence = 1;
                    character.charisma = 1;
                    character.class = Class.Warrior;
                }; break;
                case 'rogue': {
                    character.strength = 1;
                    character.agility = 3;
                    character.intelligence = 1;
                    character.charisma = 1;
                    character.class = Class.Rogue;
                }; break;
                case 'wizard': {
                    character.strength = 1;
                    character.agility = 1;
                    character.intelligence = 3;
                    character.charisma = 1;
                    character.class = Class.Wizard;
                }; break;
            }

            var weaponStep = characterData.steps[characterData.steps.length - 1];
            var chosenItem = weaponStep.questions[0].selectedEntry;
            character.items.push(self.game.getItem(chosenItem.value));

            return character;
        }

        fight = (enemy:IEnemy) => {
            var self = this;
            self.game.combatLog = [];
            var damage = self.game.rollDice('1d6') + self.game.character.strength + self.game.calculateBonus(self.game.character, 'damage');
            var combatText = self.game.character.equipment.rightHand ? self.game.character.equipment.rightHand.attackText : '';
            combatText = self.game.character.equipment.leftHand ? (combatText ? combatText + '. ' : '') + self.game.character.equipment.leftHand.attackText : combatText;          
            enemy.hitpoints -= damage;

            if (combatText) {
                self.game.logToCombatLog(combatText);
            }

            self.game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');

            if (enemy.hitpoints <= 0) {
                self.game.logToCombatLog('You defeat the ' + enemy.name + '!');

                if (!self.game.currentLocation.enemies.some(enemy => enemy.hitpoints > 0)) {
                    self.game.currentLocation.text = self.game.currentLocation.descriptions['after'];
                }
            }

            self.game.currentLocation.enemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                var enemyDamage = self.game.rollDice(enemy.attack) + self.game.calculateBonus(<any>enemy, 'damage');              
                self.game.logToCombatLog('The ' + enemy.name + ' does ' + enemyDamage + ' damage!');
                self.game.character.currentHitpoints -= enemyDamage;            
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

        enterLocation(location: ICompiledLocation) {
            var self = this;

            if (self.game.worldProperties.travelCounter !== undefined) {
                self.game.worldProperties.travelCounter++;

                var isDay = Math.floor(self.game.worldProperties.travelCounter / 3 + 1) % 2 !== 0;
                self.game.worldProperties.isDay = isDay;
                self.game.worldProperties.isNight = !isDay;
            }
        }
    }

    RuleService.$inject = ['game'];
}