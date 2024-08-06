import { EquipmentType, ICombinationMatchResult } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';
import { Combinations } from '../combinations';

export function Herbs() {
    return Item({
        name: 'Herbs',
        picture: 'herbs.png',
        equipmentType: EquipmentType.Miscellaneous,
        combinations: {
            combine: [
                {
                    combinationType: Combinations.TOUCH,
                    match: (game, target, tool): ICombinationMatchResult => {
                        game.activeCharacter.items.add(Herbs);
                        return { 
                            text: 'You collect the herbs.', 
                            removeTarget: true 
                        };
                    }
                },
            ]
        }
    });
}