import { IGame, IItem, Location } from '../types';
import { Start } from './start';
import description from './Library.html?raw';

export function Library() {
    return Location({
        name: 'Library',
        description: description,
        destinations: [
            {
                name: 'Back to the living room',
                target: Start
            }
        ],
        trade: [{
            name: 'Your personal closet',
            text: 'Do you want to take something out of your closet or put it back in?',
            buy: {
                text: 'Take out of closet',
                emptyText: 'The closet is empty',
                itemSelector: (game: IGame, item: IItem) => {
                    return item.value !== undefined;
                },
                maxItems: 5,
                priceModifier: 0
            },
            sell: {
                text: 'Put back in closet',
                emptyText: 'You have nothing to put in the your closet',
                itemSelector: (game: IGame, item: IItem) => {
                    return item.value !== undefined;
                },
                maxItems: 5,
                priceModifier: (game: IGame) => {
                    return 0;
                }
            }
        }]
    });
}