import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Healthpotion() {
    return Item({
        name: 'Health Potion',
        damage: '2',
        equipmentType: EquipmentType.Miscellaneous,
        dayAvailable: 1,
        arcane: true,
        value: 5,
        useInCombat: true,
        itemClass: [Class.Rogue, Class.Warrior, Class.Wizard],
        use: (game, item) => {
            game.character.currentHitpoints += 5;
            game.character.items.remove(item);
        }
    });
}