import { Enemy, IGame } from '../types';

export function Twoheadedwolf() {
    return Enemy({
        name: 'Two-Headed Wolf',
        hitpoints: 20,
        damage: '1d8',
        reward: 4,
        onAttack: (game: IGame) => {
            if (game.worldProperties.freedFaeries) {
                game.logToLocationLog(game.currentLocation.descriptions['freedfaeries']);
                game.currentLocation.enemies.clear();
            }
        }
    });
}