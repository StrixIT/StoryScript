import { IGame } from './types';

export function setLocationDescription(game: IGame) {
    game.currentDescription = {
        title: game.currentLocation.name,
        type: 'location',
        item: {
            name: '',
            description: game.currentLocation.description
        }
    }
}