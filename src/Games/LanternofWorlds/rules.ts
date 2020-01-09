import { IRules, ICharacter, ICreateCharacter, ICombinable, ICombinationAction, GameState, PlayState } from 'storyScript/Interfaces/storyScript';
import { IGame, IFeature, IEnemy, Character, IItem } from './types';
import { Constants } from './Constants';
import { Sword } from './items/sword';
import { Potion } from './items/potion';
import { setLocationDescription } from './helpers';

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
                game.changeLocation(game.worldProperties.startChoice.name, true);
                setPlayerPosition(game, game.worldProperties.startChoice.tile);
            },
            continueGame: (game: IGame) => {
                setPlayerPosition(game, game.worldProperties.mapPosition);
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
                            // When not moving, re-show the overlay and quit.
                            if (game.worldProperties.mapPosition === target.id) {
                                showElements(game, false, target.linkToLocation);
                                return '';
                            }

                            //Check whether the player can move to the tile selected first.
                            if (!canMoveToTile(game, target)) {
                                return '';
                            }

                            game.worldProperties.mapPosition = target.id;

                            setCoordinates(game, target);

                            // Hide the location overlay while the player is travelling.
                            showElements(game, true, target.linkToLocation);

                            return '';
                        },
                    }
                ];
            }
        },

        general: {  
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            },
            playStateChange: (game: IGame, newState: PlayState, oldState: PlayState) => {
                var stateStyles = new Map<PlayState, string>();
                stateStyles.set(PlayState.Combat, 'combat-modal');
                stateStyles.set(PlayState.Description, 'description-modal');
                stateStyles.set(PlayState.Trade, 'trade-modal');

                var newClass = stateStyles.get(newState);

                if (newClass) {
                    setTimeout(() => {
                        game.dynamicStyles = [
                            {
                                elementSelector: '.modal-content-wrapper',
                                styles: [
                                    ['modal-content-wrapper'],
                                    [newClass]
                                ]
                            }
                        ];
                    }, 0);
                }
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
                var startChoice = { name: 'start', tile: 'ca_1-1' };

                if (selectedStart && selectedStart.text) {
                    startChoice = selectedStart.text === 'You are a druid' ? { name: 'druidstart', tile: 'fo_2-2' }
                        : selectedStart.text === 'You are a fisherman' ? { name: 'druidstart', tile: 'fo_2-2' }
                        : selectedStart.text === 'You are a veteran warrior' ?{ name: 'druidstart', tile: 'fo_2-2' } : startChoice;
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
            },
            beforeDrop: (game: IGame, enemy: IEnemy, item: IItem): boolean => {
                // Instead of dropping items to the ground, put them in the character inventory.
                game.character.items.push(item);
                return false;
            }
        },
    };

    function setPlayerPosition(game: IGame, position: string) {
        var startFeature = game.currentLocation.features.get(position);

        if (startFeature) {
            game.worldProperties.mapPosition = startFeature.id;
            setCoordinates(game, startFeature);
            showElements(game, true);
        }
    }

    function canMoveToTile(game: IGame, target: IFeature) {
        var targetParts = target.id.split('_');

        if (targetParts.length === 1) {
            return true;
        }

        var targetlocation = targetParts[1].split('-').map(c => parseInt(c));

        var currentPosition= game.worldProperties.mapPosition;

        if (!currentPosition) {
            return false;
        }
        
        var currentLocation = currentPosition.split('_')[1].split('-').map(c => parseInt(c));
        var row = currentLocation[0];
        var col = currentLocation[1];
        var even = col % 2 === 0;

        var allowedPositions =
        even ? [
            `${row}_${col - 1}`,
            `${row + 1}_${col - 1}`,
            `${row + 1}_${col + 1}`,
            `${row}_${col + 1}`
        ] : [
            `${row - 1}_${col - 1}`,
            `${row}_${col - 1}`,
            `${row}_${col + 1}`,
            `${row - 1}_${col + 1}`
        ];

        // You can always go up or down one column
        allowedPositions.push(`${row - 1}_${col}`);
        allowedPositions.push(`${row + 1}_${col}`);

        if (allowedPositions.indexOf(`${targetlocation[0]}_${targetlocation[1]}`) > -1) {
            return true;
        }

        return false;
    }
}

export function setCoordinates(game: IGame, target: IFeature) {
    var coords = target.coords.split(',').map(c => parseInt(c));
    game.worldProperties.mapLocationX = -(coords[0] - Constants.MAPOFFSETX);
    game.worldProperties.mapLocationY = -(coords[1] - Constants.MAPOFFSETY);   

    setDynamicStyles(game);
}

export function showElements(game: IGame, timeout: boolean, location?: string) {
    let showOnMap = game.locations.get(location).showOnMap;
    showOnMap = showOnMap === undefined ? true : showOnMap;

    var styles = [{
        elementSelector: '#player-icon',
        styles: [
            ['display', showOnMap ? 'block' : 'none']
        ]
    }];
    
    styles.push({
        elementSelector: '.modal-content-wrapper',
        styles: [
            ['background-image', 'url(\'resources/maps/CaveBackground.png\')']
        ]
    });

    if (timeout) {
        setTimeout(() => {
            if (location) {
                game.changeLocation(location);
            }

            game.dynamicStyles = styles;

            if (location) {
                setLocationDescription(game);
            }

        }, 1000);
    } else {
        setLocationDescription(game);
        game.dynamicStyles = styles;
    }
}

function setDynamicStyles(game: IGame) {
    game.dynamicStyles = [
        {
            elementSelector: '#visual-features img',
            styles: [
                ['margin-top', (game.worldProperties.mapLocationY || 0).toString() + 'px'],
                ['margin-left', (game.worldProperties.mapLocationX || 0).toString() + 'px']
            ]
        }
    ];   
}