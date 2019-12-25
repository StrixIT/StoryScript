import { IGame, IItem, Person } from '../types';
import { Sword } from '../items/sword';
import { Garden } from '../locations/Garden';
import { Journal } from '../quests/journal';
import conversation from './Friend.html';

export function Friend() {
    return Person({
        description: conversation,
        name: 'Joe',
        hitpoints: 10,
        attack: '1d6',
        items: [
            Sword()
        ],
        currency: 10,
        trade: {
            ownItemsOnly: true,
            buy: {
                description: 'I\'m willing to part with these items...',
                emptyText: 'I have nothing left to sell to you...',
                itemSelector: (game: IGame, item: IItem) => {
                    return item.value != undefined;
                },
                maxItems: 5
            },
            sell: {
                description: 'These items look good, I\'d like to buy them from you',
                emptyText: 'You have nothing left that I\'m interested in',
                itemSelector: (game: IGame, item: IItem) => {
                    return item.value != undefined;
                },
                maxItems: 5
            }
        },
        conversation: {
            actions: {
                'addHedgehog': (game, person) => {
                    var garden = game.locations.get(Garden);
                    garden.hasVisited = false;

                    garden.enterEvents.push((game: IGame) => {
                        game.logToLocationLog('Ah! There is the hedgehog Joe was talking about.');
                    });
                }
            }
        },
        quests: [
            Journal()
        ]
    });
}