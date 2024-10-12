import {ClassType} from '../classType';
import description from './BeeSting.html?raw';
import {Constants} from '../constants';
import {IEnemy, IGame, Item} from '../types';
import {TargetType} from '../../../Engine/Interfaces/storyScript';

export function BeeSting() {
    return Item({
        name: 'Bee\'s Sting',
        description: description,
        damage: '1D8',
        speed: 4,
        damageSpecial: (game: IGame, enemy: IEnemy) => {
            enemy.currentHitpoints = Math.max(enemy.currentHitpoints - 2, 0);
            game.combatLog.push(`${enemy.name} takes 2 poison damage!`);
        },
        equipmentType: Constants.PrimaryWeapon,
        attackText: '{0} swings Bee\'s Sting',
        itemClass: ClassType.Warrior,
        targetType: TargetType.Enemy,
    });
}