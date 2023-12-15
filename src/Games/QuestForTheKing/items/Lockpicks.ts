import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Lockpicks.html';

export function Lockpicks() {
    return Item({
        name: 'Lockpicks',
        description: description,
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You use the lockpicks',
        itemClass: ClassType.Rogue
    });
}