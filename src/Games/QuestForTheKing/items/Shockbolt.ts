import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Shockbolt.html';

export function Shockbolt() {
    return Item({
        name: 'Shockbolt',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        dayAvailable: 2,
        arcane: true,
        value: 15,
        attackText: 'You cast your shockbolt',
        itemClass: Class.Wizard
    });
}