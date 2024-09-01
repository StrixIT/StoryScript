import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Goldnecklace.html?raw';
import { heal } from '../gameFunctions';
import { ClassType } from '../classType';
import { Item } from '../types';

export function Goldnecklace() {
    return Item({
        name: 'Necklace',
        description: description,
        equipmentType: EquipmentType.Amulet,
        speed: 7,
        arcane: true,
        value: 65,
        itemClass: [ClassType.Rogue, ClassType.Warrior, ClassType.Wizard],
        activeNight: true,
        useInCombat: true,
        use(game, character, item, target) {
            heal(character, 3);
        },   
    });
}