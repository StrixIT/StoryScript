import { Item } from '../types';
import { EquipmentType, ICombinationMatchResult } from 'storyScript/Interfaces/storyScript';
import { Combinations } from '../combinations';

export function PlaceEmpire() {
    return Item({
        name: 'place_empire',
        description: 'The Empire is a powerful and influential organization.',
        equipmentType: EquipmentType.Miscellaneous,
        combinations: {
            combine: [
                {
                    combinationType: Combinations.LOOKAT,
                    match: (game, target, tool): string | ICombinationMatchResult => {
                        if (game.activeCharacter.items.get(PlaceEmpire)) {
                            return { 
                            text: 'The Empire strikes back!', 
                            removeTarget: false
                        };
                        }
                        
                        game.activeCharacter.items.add(PlaceEmpire);
                        return { 
                            text: 'The Empire has been added to your notebook!', 
                            removeTarget: false
                        };
                    }
                },
            ]
        }
    });
}