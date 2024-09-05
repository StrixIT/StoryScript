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
        use: (game, character, item, target) => {
            const potency = 5;
            target.currentHitpoints = Math.min(target.hitpoints, target.currentHitpoints + potency);
            character.items.delete(item);
            game.logToCombatLog(`${character.name} uses the ${item.name} to heal ${target.name} for ${potency} hitpoints.`);
        }
    });
}