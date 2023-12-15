import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Rapier.html';

export function Rapier() {
    return Item({
        name: 'Rapier',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You thrust your rapier',
        itemClass: ClassType.Rogue
    });
}