import { IGame, Item } from '../types';
import { EquipmentType } from '../../../Engine/Interfaces/storyScript';

export function Sword() {
    return Item({
        name: 'Sword',
        equipmentType: EquipmentType.Hands,
        combatSound: 'sword-unsheathe5.wav'
    });
}