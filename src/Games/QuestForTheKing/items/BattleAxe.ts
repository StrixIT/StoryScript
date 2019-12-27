import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Battleaxe() {
    return Item({
        name: 'Battle Axe',
        damage: '1D8',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You swing your battle axe',
        itemClass: Class.Warrior
    });
}