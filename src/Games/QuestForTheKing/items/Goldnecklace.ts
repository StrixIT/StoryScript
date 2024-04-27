import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Goldnecklace.html';
import { heal } from '../gameFunctions';

export function Goldnecklace() {
    return Item({
        name: 'Necklace',
        description: description,
        equipmentType: EquipmentType.Amulet,
        speed: 7,
        arcane: true,
        value: 5,
        activeNight: true,
        useInCombat: true,
        use(game, item, target) {
            heal(game.activeCharacter, 3);
        },   
    });
}