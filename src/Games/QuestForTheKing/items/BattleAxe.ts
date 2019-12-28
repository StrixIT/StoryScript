import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './BattleAxe.html';

export function Battleaxe() {
    return Item({
        name: 'Battle Axe',
        description: description,
        damage: '1D8',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You swing your battle axe',
        itemClass: Class.Warrior
    });
}