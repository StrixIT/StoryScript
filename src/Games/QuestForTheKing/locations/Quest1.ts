import { Location, IGame } from '../types';
import description from './Quest1.html';
import { Start } from './ForestOfMyrr/start';

export function Quest1() {
    return Location({
        name: 'Your First Quest',
        description: description,
        destinations: [
            {
                name: 'Begin your Quest',
                target: Start
            }
        ],
        enterEvents: [
            (game: IGame) => {
                game.worldProperties.travelCounter = 0;
            }
        ]
    });
}