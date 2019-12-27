import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function DetectMagic() {
    return Item({
        name: 'Detect Magic',
        damage: '2',
        equipmentType: EquipmentType.Hands,
        dayAvailable: 1,
        arcane: true,
        value: 7,
        itemClass: Class.Wizard    
    });
}