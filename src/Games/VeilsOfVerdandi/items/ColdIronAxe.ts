import {ClassType} from '../classType';
import description from './ColdIronAxe.html?raw';
import {Item} from '../types';
import {ShadowDog} from '../enemies/ShadowDog';
import {Constants} from '../constants';
import {TargetType} from '../../../Engine/Interfaces/storyScript';
import {specialDamage} from "../combatRules.ts";

export function ColdIronAxe() {
    return Item({
        name: 'Cold Iron Axe',
        description: description,
        damage: '1D6',
        damageSpecial: (game, enemy, damage) => specialDamage(game, enemy, damage, ShadowDog, '1d6', 'cold iron'),
        speed: 6,
        equipmentType: Constants.PrimaryWeapon,
        value: 30,
        attackText: '{0} swings the Cold Iron Axe',
        itemClass: ClassType.Warrior,
        targetType: TargetType.Enemy,
    });
}