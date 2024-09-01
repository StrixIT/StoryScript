import { ClassType } from '../classType';
import description from './Beesting.html?raw';
import { Constants } from '../constants';
import { IEnemy, IGame, Item } from '../types';
import { TargetType } from '../../../Engine/Interfaces/storyScript';

export function Beesting() {
    return Item({
        name: 'Beesting',
        description: description,
        damage: '1D8',
        speed: 4,
        damageBonus: (game: IGame, enemy: IEnemy) => {
            // Todo: apply poison
            return 0;
        },
        equipmentType: Constants.PrimaryWeapon,
        value: 20,       
        itemClass: ClassType.Warrior,
        targetType: TargetType.Enemy,
    });
}