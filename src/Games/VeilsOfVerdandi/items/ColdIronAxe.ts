import { ClassType } from '../classType';
import description from './ColdIronAxe.html?raw';
import { IEnemy, IGame, Item } from '../types';
import { equals } from 'storyScript/utilityFunctions';
import { ShadowDog } from '../enemies/ShadowDog';
import { Constants } from '../constants';
import { TargetType } from '../../../Engine/Interfaces/storyScript';

export function ColdIronAxe() {
    return Item({
        name: 'Cold Iron Axe',
        description: description,
        damage: '1D6',
        damageBonus: (game: IGame, enemy: IEnemy) => {
            if (equals(enemy, ShadowDog)) {
                return game.helpers.rollDice('1d6')
            }

            return 0;
        },
        speed: 6,
        equipmentType: Constants.PrimaryWeapon,
        value: 30,
        attackText: '{0}} swings the Cold Iron Axe',
        itemClass: ClassType.Warrior,
        targetType: TargetType.Enemy,
    });
}