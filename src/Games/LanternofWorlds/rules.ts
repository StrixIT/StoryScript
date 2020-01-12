import { IRules, ICharacter, ICreateCharacter, ICombinable, ICombinationAction, GameState, PlayState } from 'storyScript/Interfaces/storyScript';
import { clone } from 'storyScript/utilities';
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
                    {
                        text: 'Walk',
                        preposition: 'to',
                        requiresTool: false,
                        failText: (game, target, tool): string => { return 'test'; },
                        isDefault: true,
                        defaultMatch: (game: IGame, target: IFeature, tool: ICombinable): string => {
                            // When not moving, re-show the overlay or re-enter the location and quit.
                            if (game.worldProperties.mapPosition === target.id) {

                                if (target.linkToLocation) {
                                    if (game.currentLocation.id !== target.linkToLocation) {
                                        game.changeLocation(target.linkToLocation);
                                    }

                                    setLocationDescription(game);
                                    showAvatar(game, showOnMap(game, target.linkToLocation));
                                }

                                return '';
                            }

                            //Check whether the player can move to the tile selected first.
                            if (!canMoveToTile(game, target)) {
                                return '';
                            }

                            game.worldProperties.mapPosition = target.id;

                            if (target.linkToLocation) {
                                const location = game.locations.get(target.linkToLocation);
                                const currentMapTarget = <IFeature>game.currentLocation.features.filter((f: IFeature) => f.linkToLocation == target.linkToLocation)[0];
                                const locationMapTarget = location.features.filter((f: IFeature) => f.linkToLocation == target.linkToLocation)[0];
                                const newMap = locationMapTarget && currentMapTarget.id.substring(0, 2) !== locationMapTarget.id.substring(0, 2);

                                if (newMap) {
                                    moveToNewMap(game, currentMapTarget, locationMapTarget);
                                }
                                else {
                                    
                                    game.worldProperties.mapPosition = target.id;

                                    setDynamicStyles(game, target);

                                    setTimeout(() => {
                                        game.changeLocation(target.linkToLocation);
                                        showAvatar(game, showOnMap(game, target.linkToLocation));
                                        setLocationDescription(game);
                                    }, 1000);
                                }
                            }
                            else {
                                setDynamicStyles(game, target);
                            }

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
                    // We need a timeout here to allow the modal to be attached before we look for it.
                    setTimeout(() => {
                        const modalWrapper = game.UIRootElement.querySelector('.modal-content-wrapper');
                        modalWrapper.className = `modal-content-wrapper ${newClass}`;
                    }, 0);
                }
            },
            beforeSave: (game: IGame): void => {
                var maps = groupBy(game.locations.filter(l => l.features?.collectionPicture).map(l => l.features? { name: l.features.collectionPicture, map: l.features } : null).filter(e => e !== null), e => e.name);
                game.worldProperties.maps = clone(Array.from(maps.values()).map(a => { return { name: a[0].name, map: a[0].map }; }));
                game.locations.filter(l => l.features?.collectionPicture).forEach(l => {
                    l.features.length = 0;
                })
            },
            afterSave: (game: IGame): void => {
                attachMap(game);
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
                                            value: '2',
                                            finish: true
                                        },
                                        {
                                            text: 'Use the alternate start',
                                            value: '1'
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
                var startChoice = { name: 'druidstart', tile: 'fo_2-2' };

                // if (selectedStart && selectedStart.text) {
                //     startChoice = selectedStart.text === 'You are a druid' ? { name: 'druidstart', tile: 'fo_2-2' }
                //         : selectedStart.text === 'You are a fisherman' ? { name: 'druidstart', tile: 'fo_2-2' }
                //         : selectedStart.text === 'You are a veteran warrior' ?{ name: 'druidstart', tile: 'fo_2-2' } : startChoice;
                // }

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
        var startFeature = <IFeature>game.currentLocation.features.get(position);

        if (startFeature) {
            game.worldProperties.mapPosition = startFeature.id;

            // We need a timeout here to allow the UI to initialize first.
            setTimeout(() => {
                setDynamicStyles(game, startFeature);

                setTimeout(() => {
                    if (startFeature.linkToLocation) {
                        if (showOnMap(game, startFeature.linkToLocation)) {
                            setLocationDescription(game);
                        }
                    }
        
                    showAvatar(game, true);
                }, 1000);
            }, 0);
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

    function showOnMap(game: IGame, locationId: string) {
        const showOnMap = game.locations.get(locationId)?.showOnMap;
        return showOnMap === undefined ? true : showOnMap;
    }

    function setDynamicStyles(game: IGame, target: IFeature = null) {
        if (target) {
            var coords = target.coords.split(',').map(c => parseInt(c));
            game.worldProperties.mapLocationX = -(coords[0] - Constants.MAPOFFSETX);
            game.worldProperties.mapLocationY = -(coords[1] - Constants.MAPOFFSETY);   
        }

        const featureImg = <HTMLElement>game.UIRootElement.querySelector('#visual-features img');
        featureImg.style.cssText = 'margin-top: ' + (game.worldProperties.mapLocationY || 0).toString() + 'px; ' + 'margin-left: ' + (game.worldProperties.mapLocationX || 0).toString() + 'px';
    }

    function moveToNewMap(game: IGame, currentMapTarget: IFeature, newMaptarget: IFeature) {
        game.worldProperties.mapPosition = currentMapTarget.id;

        setDynamicStyles(game, currentMapTarget);

        // We need a nested timeout to first travel to the tile linking to the new map,
        // and then to the tile on the new map.
        setTimeout(() => {
            game.changeLocation(newMaptarget.linkToLocation);
            game.worldProperties.mapPosition = newMaptarget.id;
            showAvatar(game, false);
            setDynamicStyles(game, newMaptarget);

            setTimeout(() => {
                showAvatar(game, showOnMap(game, newMaptarget.linkToLocation));
                setLocationDescription(game);
            }, 1000);
        }, 1000);
    }

    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
             const key = keyGetter(item);
             const collection = map.get(key);
             if (!collection) {
                 map.set(key, [item]);
             } else {
                 collection.push(item);
             }
        });
        return map;
    }

    function attachMap(game: IGame): void {
        game.locations.filter(l => l.features?.collectionPicture).forEach(l => {
            var features = game.worldProperties.maps?.find(m => m.map.collectionPicture === l.features.collectionPicture).map;
            features?.forEach(f => l.features.push(f));
        });
    }
}

export function showAvatar(game: IGame, show: boolean) {
    let player = <HTMLElement>game.UIRootElement.querySelector('#player-icon');
    const isVisible = player.style.display === 'block' ? true : false;

    if (show !== isVisible) {
        player.style.display = show ? 'block' : 'none';
    }
}