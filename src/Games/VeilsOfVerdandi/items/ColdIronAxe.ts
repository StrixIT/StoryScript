import {ClassType} from '../classType';
import description from './ColdIronAxe.html?raw';
import {IEnemy, IGame, Item} from '../types';
import {equals} from 'storyScript/utilityFunctions';
import {ShadowDog} from '../enemies/ShadowDog';
import {Constants} from '../constants';
import {TargetType} from '../../../Engine/Interfaces/storyScript';

export function ColdIronAxe() {
    return Item({
        name: 'Cold Iron Axe',
        description: description,
        damage: '1D6',
        damageSpecial: (game: IGame, enemy: IEnemy) => {
            if (equals(enemy, ShadowDog)) {
                let additionalDamage = game.helpers.rollDice('1d6');
                additionalDamage = Math.max(additionalDamage - enemy.defence, 0);

                if (additionalDamage > 0) {
                    enemy.currentHitpoints = Math.max(enemy.currentHitpoints - additionalDamage, 0);
                    game.combatLog.push(`The iron does an additional ${additionalDamage} to the Shadow Dog!`)
                }
            }
        },
        speed: 6,
        equipmentType: Constants.PrimaryWeapon,
        value: 30,
        attackText: '{0} swings the Cold Iron Axe',
        itemClass: ClassType.Warrior,
        targetType: TargetType.Enemy,
    });
}