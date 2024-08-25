import { Item, EquipmentType, TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Healthpotion.html?raw';

export function Healthpotion() {
    return Item({
        name: 'Health Potion',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Miscellaneous,
        dayAvailable: 1,
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