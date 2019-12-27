import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Chainmail() {
    return Item({
        name: 'Chain Mail',
        damage: '2',
        equipmentType: EquipmentType.Body,
        dayAvailable: 2,
        arcane: false,
        value: 20,
        itemClass: Class.Warrior
    });
}