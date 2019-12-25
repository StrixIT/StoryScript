import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/enumerations/equipmentType';

export function Potion() {
    return Item({
        name: 'Potion',
        equipmentType: EquipmentType.Miscellaneous,
        useInCombat: true,
        useSound: 'metal-ringing.wav',
        value: 5
    });
}