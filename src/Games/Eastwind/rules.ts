import { IRules, ICharacter, ICreateCharacter, ICombinationAction, GameState } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character, ILocation } from './types';

export function Rules(): IRules {
    return {
        setup: {
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
                ];
            },playList:[
                [GameState.Play,'underwater.mp3']
            ],autoBackButton: false
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
                        // Add the character creation steps here, if you want to use character creation.
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var character = new Character();
                return character;
            }
        },

        exploration: {
            enterLocation: (game: IGame, location: ILocation, travel?: boolean) => {
                if (location.background_class) {
                    // When refreshing the page, the UIRootElement is not yet on the game so use a timeout.
                    if (game.UIRootElement) {
                        setGradient(game.UIRootElement, location.background_class);
                    }
                    else {
                        setTimeout(() => {
                            setGradient(game.UIRootElement, location.background_class);
                        });
                    }
                }
            }
        },

        combat: {     
            fight: (game: IGame, enemy: IEnemy): void => {
                if (game.character.equipment.rightHand?.attackText) {
                    game.logToCombatLog(game.character.equipment.leftHand?.attackText);
                }

                if (game.character.equipment.rightHand?.attackSound) {
                    game.sounds.playSound(game.character.equipment.rightHand?.attackSound);
                }

                if (game.character.equipment.leftHand?.attackText) {
                    game.logToCombatLog(game.character.equipment.leftHand?.attackText);
                }

                if (game.character.equipment.leftHand?.attackSound) {
                    game.sounds.playSound(game.character.equipment.leftHand?.attackSound);
                }

                var damage = game.helpers.rollDice('1d6') + game.character.strength + game.helpers.calculateBonus(game.character, 'damage');
                game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');
                enemy.hitpoints -= damage;

                if (enemy.hitpoints <= 0) {
                    game.logToCombatLog('You defeat the ' + enemy.name + '!');
                }

                game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(enemy => {
                    var damage = game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
                    game.logToCombatLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                    game.character.currentHitpoints -= damage;
                });
            }
        }
    };
}

function setGradient(element: HTMLElement, className: string) {
    element.classList.forEach(c => { 
        if (c.startsWith('gradient')) {
            element.classList.remove(c);
        } 
    });

    element.classList.add(className);
}