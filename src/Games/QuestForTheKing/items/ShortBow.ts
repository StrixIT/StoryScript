import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './ShortBow.html';
import { ClassType } from '../classType';

export function ShortBow() {
	return Item({
		name: 'ShortBow',
		description: description,
		damage: '2',
		equipmentType: EquipmentType.RightHand,
		arcane: false,
		value: 15,
        attackText: 'You swing your shortsword',
        itemClass: [ ClassType.Rogue, ClassType.Warrior ]
	});
}