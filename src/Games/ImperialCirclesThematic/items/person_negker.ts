import { Item } from '../types';
import { EquipmentType, ICombinationMatchResult } from 'storyScript/Interfaces/storyScript';
import description from './person_negker.html?raw';
import { Combinations } from '../combinations';

export function PersonNegker() {
    return Item({
        name: 'person_negker',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        combinations: {
            combine: [
                {
                    combinationType: Combinations.LOOKAT,
                    match: (game, target, tool): string | ICombinationMatchResult => {
                        if (game.activeCharacter.items.get(PersonNegker)) {
                            return description;
                        }
                        
                        game.activeCharacter.items.add(PersonNegker);
                        return { 
                            text: 'Jost de Negker has been added to your notebook!', 
                            removeTarget: false
                        };
                    }
                },
            ]
        }
    });
}