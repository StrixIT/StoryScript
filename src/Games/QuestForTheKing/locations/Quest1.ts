import { Location, IGame } from '../types';
import description from './Quest1.html';
import { Quest1map1 } from './Maps/Quest1map1';

export function Quest1() {
    return Location({
        name: 'Your First Quest',
        description: description,
        destinations: [
            {
                name: 'Begin your Quest',
                target: Quest1map1
            }
        ],
        enterEvents: [
            (game: IGame) => {
                game.worldProperties.travelCounter = 0;
            }
        ]
    });
}