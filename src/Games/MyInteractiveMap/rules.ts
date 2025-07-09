import { IRules, ICharacter, ICreateCharacter, ICombinationAction } from 'storyScript/Interfaces/storyScript';
import {IGame, IEnemy, Character, ICombatSetup, ICompiledLocation} from './types';

export function Rules(): IRules {
    return {
        setup: {
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
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
            enterLocation(game: IGame, location: ICompiledLocation, travel?: boolean) {
                const map = game.currentMap;
                
                setTimeout(() => {
                    const coordString = map.locations.find(l => l.location === game.currentLocation.id)?.coords;

                    if (coordString) {
                        const coords = coordString.split(',');
                        
                        const avatar = <any>game.UIRootElement.getElementsByClassName('avatar-image')[0];
                        const top = parseInt(coords[1]) - avatar.height / 2;
                        const left = parseInt(coords[0]) - avatar.width / 2;
                        
                        avatar.style.top = `${top}px`;
                        avatar.style.left = `${left}px`;
                    }  
                    // This timeout is needed to allow the UI components to render and have the avatar dimensions available.
                }, 250);
            }
        },

        combat: {     
            fight: (game: IGame, combatSetup: ICombatSetup, retaliate?: boolean) => {
                retaliate = retaliate ?? retaliate;

                // Implement character attack here.

                if (retaliate) {
                    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.currentHitpoints > 0; }).forEach(enemy => {
                        // Implement monster attack here
                    });
                }
            }
        }
    };
}