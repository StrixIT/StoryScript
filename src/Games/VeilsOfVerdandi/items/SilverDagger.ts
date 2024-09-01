import { IEnemy, IGame, Item } from '../types';
import { TargetType } from 'storyScript/Interfaces/storyScript';
import description from './SilverDagger.html?raw';
import { Constants } from '../constants';
import { ClassType } from '../classType';
import { equals } from '../../../Engine/utilityFunctions';
import { Ghost } from '../enemies/Ghost';

export function SilverDagger() {
	return Item({
        name: 'Silver Dagger',
        description: description,
        damage: '1d4',
		damageBonus: (game: IGame, enemy: IEnemy) => {
            if (equals(enemy, Ghost)) {
				return game.helpers.rollDice('1d4');
			}

            return 0;
        },
        speed: 3,
        equipmentType: Constants.PrimaryWeapon,
        value: 25,
        attackText: '{0} thrusts the Silver Dagger',
        itemClass: [ClassType.Rogue],
		targetType: TargetType.Enemy
	});
}