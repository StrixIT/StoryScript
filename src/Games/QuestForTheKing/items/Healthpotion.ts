import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Healthpotion.html';

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
        itemClass: [ClassType.Rogue, ClassType.Warrior, ClassType.Wizard],
        use: (game, item) => {
            game.character.currentHitpoints += 5;
            game.character.items.remove(item);
        }
    });
}