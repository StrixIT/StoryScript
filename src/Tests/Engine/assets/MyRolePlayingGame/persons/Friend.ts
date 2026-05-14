import { IGame, IItem, IPerson, Person } from '../types';
import { Sword } from '../items/sword';
import { Garden } from '../locations/Garden';
import { Journal } from '../quests/journal';
import conversation from './Friend.html?raw';

export function Friend() {
    return Person({
        description: conversation,
        name: 'Joe',
        hitpoints: 10,
        attack: '1d6',
        canAttack: false,
        items: [
            Sword()
        ],
        currency: 10,
        trade: {
            ownItemsOnly: true,
            buy: {
                text: 'I\'m willing to part with these items...',
                emptyText: 'I have nothing left to sell to you...',
                itemSelector: (_: IGame, item: IItem) => {
                    return item.value !== undefined;
                },
                maxItems: 5
            },
            sell: {
                text: 'These items look good, I\'d like to buy them from you',
                emptyText: 'You have nothing left that I\'m interested in',
                itemSelector: (_: IGame, item: IItem) => {
                    return item.value !== undefined;
                },
                maxItems: 5
            }
        },
        conversation: {
            actions: [[
                'addHedgehog', (game: IGame, _: IPerson) => {
                    const garden = game.locations.get(Garden);
                    garden.hasVisited = false;

                    garden.enterEvents.add(['Hedgehog', (game: IGame) => {
                        game.logToLocationLog('Ah! There is the hedgehog Joe was talking about.');
                    }]);
                }
            ]]
        },
        quests: [
            Journal()
        ]
    });
}