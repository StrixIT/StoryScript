import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Lockpicks() {
    return Item({
        name: 'Lockpicks',            
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You use the lockpicks',
        itemClass: Class.Rogue
    });
}