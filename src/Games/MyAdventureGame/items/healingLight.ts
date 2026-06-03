import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
export function HealingLight() {
	return Item({
		name: 'Healing light',
		animation: {
			sheet: 'candlelight_anim.png',
			width: 48,
			speed: 1,
		},
		equipmentType: EquipmentType.Miscellaneous,
	});
}