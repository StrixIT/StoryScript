import { EquipmentType, ICombinationMatchResult } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';
import { Constants } from '../constants';

export function Herbs() {
    return Item({
        name: 'Herbs',
        picture: 'herbs.png',
        equipmentType: EquipmentType.Miscellaneous,
        combinations: {
            combine: [
                {
                    combinationType: Constants.TOUCH,
                    match: (game, target, tool): ICombinationMatchResult => {
                        game.character.items.push(Herbs);
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