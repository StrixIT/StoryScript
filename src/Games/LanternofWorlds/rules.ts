import { IRules, ICharacter, ICreateCharacter, ICombinable, ICombinationAction, GameState, PlayState } from '../../Engine/Interfaces/storyScript';
import { IGame, IFeature, IEnemy, Character, IItem } from './types';
import { Constants } from './Constants';
import { Sword } from './items/sword';
import { Potion } from './items/potion';

export function Rules(): IRules {
    return {
        setup: {
            intro: true,
            playList: [
                [GameState.Play, 'play.mp3'],
                [PlayState.Combat, 'createCharacter.mp3'],
            ],
            gameStart: (game: IGame) => {
                game.character.items.push(Sword());
                game.character.items.push(Potion());
                game.changeLocation(game.worldProperties.startChoice);
            },
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
                    {
                        text: 'Walk',
                        preposition: 'to',
                        requiresTool: false,
                        failText: (game, target, tool): string => { return 'test'; },
                        isDefault: true,
                        defaultMatch: (game: IGame, target: IFeature, tool: ICombinable): string => {
                            setCoordinates(game, target);

                            if (target.linkToLocation) {
                                game.changeLocation(target.linkToLocation);
                            }

                            return 'Ok';
                        },
                    }
                ];
            }
        },

        general: {  
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            }
        },
        
        character: {
            getSheetAttributes: (): string[] => {
                return [
                    // Add the character attributes that you want to show on the character sheet here
                ];
            },

            getCreateCharacterSheet: (): ICreateCharacter => {
                return {
                    steps: [
                        {
                            questions: [
                                {
                                    question: 'Do you want to...',
                                    entries: [
                                        {
                                            text: 'Start a regular game',
                                            value: '1',
                                            finish: true
                                        },
                                        {
                                            text: 'Use the alternate start',
                                            value: '2'
                                        },
                                        
                                    ]
                                }
                            ],
                            nextStepSelector: (character, currentStep) => {
                                switch (currentStep.questions[0].selectedEntry.value) {
                                    case '1': {
                                        return 2;
                                    };
                                    case '2': {
                                        return 1;                             
                                    };
                                    default: {
                                        return 0;
                                    }
                                }
                            }
                        },
                        {
                            questions: [
                                {
                                    question: 'Select your story',
                                    entries: [
                                        {
                                            text: 'You are a druid',
                                            value: 'intelligence',
                                            bonus: 1
                                        },
                                        {
                                            text: 'You are a veteran warrior',
                                            value: 'strength',
                                            bonus: 1
                                        },
                                        {
                                            text: 'You are a fisherman',
                                            value: 'agility',
                                            bonus: 1
                                        }
                                    ]
                                }
                            ],
                            finish: true
                        }
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var selectedStart = characterData.steps[1].questions[0].selectedEntry;
                var startChoice = 'start';

                if (selectedStart && selectedStart.text) {
                    startChoice = selectedStart.text === 'You are a druid' ? 'Druidstart'
                        : selectedStart.text === 'You are a fisherman' ? 'Fishermanstart' 
                        : selectedStart.text === 'You are a veteran warrior' ? 'forest' : 'start';
                }

                game.worldProperties.startChoice = startChoice;

                var character = new Character();
                return character;
            }
        },

        exploration: {
            onUseItem: (game: IGame, item: IItem): boolean => {
                if (item.useSound) {
                    game.sounds.playSound(item.useSound);
                }

                return true;
            }
        },

        combat: {     
            fight: (game: IGame, enemy: IEnemy, retaliate?: boolean) => {
                retaliate = retaliate == undefined ? true : retaliate;

                var playerAttackSound = game.character.equipment.hands?.combatSound ?? 'swing3.wav';

                game.sounds.playSound(playerAttackSound);

                // Implement character attack here.

                if (retaliate) {
                    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(enemy => {
                        // Implement monster attack here
                    });
                }
            }
        },
    };

    function setCoordinates(game: IGame, target: IFeature) {
        var coords = target.coords.split(',').map(c => parseInt(c));
        game.worldProperties.mapLocationX = -(coords[0] - Constants.MAPOFFSETX);
        game.worldProperties.mapLocationY = -(coords[1] - Constants.MAPOFFSETY);   

        setDynamicStyles(game);
    }

    function setDynamicStyles(game: IGame) {
        game.dynamicStyles = [
            {
                elementSelector: '#visual-features img',
                styles: [
                    ['margin-top', (game.worldProperties.mapLocationY || 0).toString() + 'px'],
                    ['margin-left', (game.worldProperties.mapLocationX || 0).toString() + 'px']
                ]
            },
            // {
            //     elementSelector: '#location-overlay',
            //     styles: [
            //         ['top', (game.worldProperties.mapLocationY + 200 || 0).toString() + 'px'],
            //         ['left', (game.worldProperties.mapLocationX + 100 || 0).toString() + 'px']
            //     ]
            // },
            // {
            //     elementSelector: '#player-icon',
            //     styles: [
            //         ['top', (game.worldProperties.mapLocationY + 400 || 0).toString() + 'px'],
            //         ['left', (game.worldProperties.mapLocationX + 700 || 0).toString() + 'px']
            //     ]
            // }
        ];   
    }
}