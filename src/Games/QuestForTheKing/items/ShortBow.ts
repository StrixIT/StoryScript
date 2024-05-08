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
        attackText: '{0}} shoots the short bow',
        itemClass: [ ClassType.Rogue, ClassType.Warrior ]
	});
}