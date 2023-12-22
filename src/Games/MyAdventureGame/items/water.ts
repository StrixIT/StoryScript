import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Constants } from '../constants';
import { Herbs } from './herbs';
import { HealingPotion } from './healingPotion';

export function Water() {
    return Item({
        name: 'Fountain water',
        equipmentType: EquipmentType.Miscellaneous,
        combinations: {
            failText: 'You can\'t use the water like that',
            combine: [
                {
                    combinationType: Constants.USE,
                    tool: Herbs,
                    match: (game, target, tool): string => {
                        game.character.items.delete(Water);
                        game.character.items.delete(Herbs);
                        game.character.items.add(HealingPotion);
                        return `You cut the herbs into small pieces and add them to the water.
                                This potion should help to heal wounds.`;
                    }
                }
            ]
        }
    });
}