import { EquipmentType, TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Healthpotion.html?raw';
import { Item } from '../types';

export function Healthpotion() {
    return Item({
        name: 'Health Potion',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        arcane: true,
        value: 5,
        useInCombat: true,
        targetType: TargetType.Ally,
        itemClass: [ClassType.Rogue, ClassType.Warrior, ClassType.Wizard],
        use: (game, character, item) => {
            character.currentHitpoints += 5;
            character.items.delete(item);
        }
    });
}