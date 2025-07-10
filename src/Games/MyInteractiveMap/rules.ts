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
                        const coordLeft = parseInt(coords[0]);
                        const coordTop = parseInt(coords[1]);
                        const mapImage = <any>game.UIRootElement.getElementsByClassName('map-image')[0];
                        const avatar = <any>game.UIRootElement.getElementsByClassName('avatar-image')[0];
                        const mapMarginLeft = getMapMargin(mapImage, coordLeft, 'width');
                        const mapMarginTop = getMapMargin(mapImage, coordTop, 'height');
                        mapImage.style.marginLeft = `-${mapMarginLeft}px`;
                        mapImage.style.marginTop = `-${mapMarginTop}px`;
                        const avatarLeft = coordLeft - mapMarginLeft - avatar.width / 2;
                        const avatarTop = coordTop - mapMarginTop - avatar.height / 2;
                        avatar.style.left = `${avatarLeft}px`;
                        avatar.style.top = `${avatarTop}px`;
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

function getMapMargin(mapImage: any, coord: number, dimension: string): number {
    const mapContainer = mapImage.parentElement;
    const clientDimension = 'client' + dimension.substring(0, 1).toUpperCase() + dimension.substring(1)
    const mapDimension = mapContainer[clientDimension];
    const viewPortCenter = mapDimension / 2;
    const maxMargin = mapImage[dimension] - mapDimension;
    let mapMargin = coord > viewPortCenter ? coord - viewPortCenter : 0;
    mapMargin = mapMargin > maxMargin ? maxMargin : mapMargin;
    return mapMargin;
}