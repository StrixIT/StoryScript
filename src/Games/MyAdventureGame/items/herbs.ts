import { Enumerations, Combinations } from '../../../Engine/Interfaces/storyScript';
import { Item } from '../types';
import { Constants } from '../constants';

export function Herbs() {
    return Item({
        name: 'Herbs',
        picture: 'herbs.png',
        equipmentType: Enumerations.EquipmentType.Miscellaneous,
        combinations: {
            combine: [
                {
                    combinationType: Constants.TOUCH,
                    match: (game, target, tool): Combinations.ICombinationMatchResult => {
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