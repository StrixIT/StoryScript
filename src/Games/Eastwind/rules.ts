import { IRules, ICharacter, ICreateCharacter, ICombinationAction, GameState } from 'storyScript/Interfaces/storyScript';
import { createPromiseForCallback } from 'storyScript/utilities';
import { ShipsHold } from './locations/ShipsHold';
import { ShipsHoldAft } from './locations/ShipsHoldAft';
import { ShipsholdFront } from './locations/ShipsholdFront';
import { IGame, IEnemy, Character, ILocation } from './types';

const combatTimeout: number = 1000;

export function Rules(): IRules {
    return {
        setup: {
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
                ];
            },
            playList:[
                [GameState.Play, 'underwater.mp3'],
                [ShipsHold, 'Shipshold.mp3'],
                [ShipsHoldAft, 'Shipshold.mp3'],
                [ShipsholdFront, 'Shipshold.mp3']
            ],
            autoBackButton: false
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
            fight: (game: IGame, enemy: IEnemy): Promise<void> | void => {
                game.combatLog.length = 0;
                var equipment = game.character.equipment;

                if (equipment.rightHand?.attackText) {
                    game.logToCombatLog(equipment.rightHand?.attackText);
                }

                if (equipment.leftHand?.attackText) {
                    game.logToCombatLog(equipment.leftHand?.attackText);
                }

                var damage = game.helpers.rollDice('1d6') + game.character.strength + game.helpers.calculateBonus(game.character, 'damage');
                var callBack = () => continueFight(game, enemy, damage);

                var attackSound = equipment.rightHand?.attackSound ?? equipment.leftHand?.attackSound;

                if (attackSound) {
                    const { promise, promiseCallback } = createPromiseForCallback<void>(callBack);
                    game.sounds.playSound(attackSound, promiseCallback);
                    return promise;              
                }
                else {
                    callBack();
                }
            }
        }
    };
}

const continueFight = function(game: IGame, currentEnemy: IEnemy, damage: number): Promise<void> | void {
    game.combatLog.push('You do ' + damage + ' damage to the ' + currentEnemy.name + '!');
    currentEnemy.hitpoints -= damage;

    if (currentEnemy.hitpoints <= 0) {
        game.combatLog.push('You defeat the ' + currentEnemy.name + '!');
    }

    var promise: Promise<void> | void = null;

    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(async enemy => {
        if (!promise) {
            promise = waitPromise();
        }
        else {
            promise = promise.then(() => waitPromise());
        }

        promise = promise.then(() => enemyAttack(game, enemy));
    });

    return promise;
}

const waitPromise = function(): Promise<void>
{
    return new Promise<void>(function(resolve) {
        setTimeout(() => {
            resolve();
          }, combatTimeout);
    });
}

const enemyAttack = function (game: IGame, enemy: IEnemy): Promise<void> | void {
    game.combatLog.push(enemy.attackText ?? 'The ' + enemy.name + ' attacks!');
    
    var attackSound = enemy.attackSound;
    var callBack = () => enemyAttacks(game, enemy);

    if (attackSound) {
        const { promise, promiseCallback } = createPromiseForCallback<void>(callBack);
        game.sounds.playSound(attackSound, promiseCallback);
        return promise;              
    }
    else {
        callBack();
    }
}

const enemyAttacks = function (game: IGame, enemy: IEnemy): Promise<void> | void {
    var damage = game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
    game.combatLog.push('The ' + enemy.name + ' does ' + damage + ' damage!');
    game.character.currentHitpoints -= damage;
}

const setGradient = function(element: HTMLElement, className: string) {
    element.classList.forEach(c => { 
        if (c.startsWith('gradient')) {
            element.classList.remove(c);
        } 
    });

    element.classList.add(className);
}