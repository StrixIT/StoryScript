import { Enemy, IGame } from '../types';

export function Octopus() {
    return Enemy({
        name: 'Giant Octopus',
        hitpoints: 20,
        damage: '1d6',
        currency: 3,
        activeDay: true,
        onDefeat: (game: IGame) => {
            game.currentLocation.actions.clear();
        }
    });
}