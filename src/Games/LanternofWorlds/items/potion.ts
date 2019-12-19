import { IGame, Item } from '../types';
import { EquipmentType } from '../../../Engine/Interfaces/storyScript';

export function Potion() {
    return Item({
        name: 'Potion',
        equipmentType: EquipmentType.Miscellaneous,
        useInCombat: true,
        useSound: 'metal-ringing.wav'
    });
}