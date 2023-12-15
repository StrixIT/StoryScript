import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Paralysis.html';

export function Paralysis() {
    return Item({
        name: 'Paralysis',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Hands,
        dayAvailable: 3,
        arcane: true,
        value: 30,
        attackText: 'You cast your Paralysis spell',
        itemClass: ClassType.Wizard
    });
}