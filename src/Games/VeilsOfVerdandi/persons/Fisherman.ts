import {IGame, IItem, Person} from '../types';
import description from './Fisherman.html?raw';
import {ColdIronAxe} from "../items/ColdIronAxe.ts";
import {Cutlass} from "../items/Cutlass.ts";
import {getId} from "storyScript/utilityFunctions.ts";
import {PowerAttack2} from "../items/PowerAttack2.ts";

export function Fisherman() {
    return Person({
        name: 'The Fisherman',
        description: description,
        hitpoints: 10,
        currency: 20,
        canAttack: false,
        activeDay: true,
        items: [
            ColdIronAxe(),
            Cutlass(),
            PowerAttack2()
        ],
        trade: {
            name: 'Fisherman\'s Inventory',
            text: 'I can see from here you boys need some training. Tell you what, hand me some gold and I will' +
                'teach you one of the tricks I learned in the old days. Oh, and I might have some trinkets' +
                'lying around too!',
            ownItemsOnly: true,
            buy: {
                text: 'Buy from the fisherman',
                emptyText: 'I have nothing left to offer you!',
                itemSelector(game: IGame, item: IItem): boolean {
                    return true;
                }
            },
            sell: {
                text: 'Sell to the fisherman',
                emptyText: 'I\'m sorry, there is nothing that you have that interests me.',
                itemSelector(game: IGame, item: IItem): boolean {
                    return item.value > 0;
                },
                priceModifier: (game: IGame): number => {
                    return 0.6;
                }
            },
            onBuy(game: IGame, item: IItem): void {
                if (item.id === getId(PowerAttack2)) {
                    game.activeCharacter.items.delete(item);
                    game.activeCharacter.equipment.special = item;
                }
            }
        },
    });
}