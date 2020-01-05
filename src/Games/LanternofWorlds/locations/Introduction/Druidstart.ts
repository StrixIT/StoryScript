import { Location, IGame, IItem } from '../../types'
import description from './Druidstart.html'
import { forestMap } from '../../maps/forest';

export function Druidstart() {
    return Location({
        name: 'Forest',
        description: description,
        destinations: [
            
        ],
        features: forestMap(),
        items: [
        ],
        enemies: [
        ],
        // persons: [
        //     Magician(),
        //     Smith()
        // ],
        // trade: [
        //     {
        //         name: 'Treasure chest',
        //         description: 'A wooden chest',
        //         buy: {
        //             description: 'Take from the chest',
        //             emptyText: '',
        //             itemSelector: (game: IGame, item: IItem): boolean => {
        //                 return true;
        //             },
        //             maxItems: 2,
        //             priceModifier: 0
        //         },
        //         sell: {
        //             description: 'Put in the chest',
        //             emptyText: '',
        //             itemSelector: (game: IGame, item: IItem): boolean => {
        //                 return true;
        //             },
        //             maxItems: 2,
        //             priceModifier: 0
        //         }
        //     },
        //     {
        //         name: 'Black closet',
        //         description: 'A dark closet',
        //         buy: {
        //             description: 'take from the closet',
        //             emptyText: '',
        //             itemSelector: (game: IGame, item: IItem): boolean => {
        //                 return true;
        //             },
        //             maxItems: 2,
        //             priceModifier: 0
        //         },
        //         sell: {
        //             description: 'Put in the closet',
        //             emptyText: '',
        //             itemSelector: (game: IGame, item: IItem): boolean => {
        //                 return true;
        //             },
        //             maxItems: 2,
        //             priceModifier: 0
        //         }
        //     }
        // ],
        enterEvents: [
        ],
        leaveEvents: [
        ],
        actions: [
        ],
        combatActions: [
        ],
    });
}