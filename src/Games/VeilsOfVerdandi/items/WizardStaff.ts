import { Item } from '../types';
import { TargetType } from 'storyScript/Interfaces/storyScript';
import description from './WizardStaff.html?raw';
import { ClassType } from '../classType';
import { Constants } from '../constants';

export function WizardStaff() {
	return Item({
		name: 'Wizard\'s Staff',
		damage: '1d4',
		description: description,
		equipmentType: Constants.PrimaryWeapon,
		value: 10,
		speed: 5,
        attackText: '{0}} swings the Wizard\'s Staff',
        itemClass: [ ClassType.Wizard ],
		targetType: TargetType.Enemy,
	});
}