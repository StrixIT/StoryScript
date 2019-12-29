import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Lockpicks.html';

export function Lockpicks() {
    return Item({
        name: 'Lockpicks',
        description: description,
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You use the lockpicks',
        itemClass: Class.Rogue
    });
}