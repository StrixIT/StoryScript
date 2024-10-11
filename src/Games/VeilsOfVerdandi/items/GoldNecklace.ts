import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import description from './GoldNecklace.html?raw';
import {ClassType} from '../classType';
import {Item} from '../types';
import {heal} from "../sharedFunctions.ts";

export function GoldNecklace() {
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