import {Item} from '../types';
import {TargetType} from 'storyScript/Interfaces/storyScript';
import description from './SilverDagger.html?raw';
import {Constants} from '../constants';
import {ClassType} from '../classType';
import {Spectre} from '../enemies/Spectre';
import {IGroupableItem} from "../interfaces/item.ts";
import {Dagger} from "./Dagger.ts";
import {specialDamage} from "../combatRules.ts";

export function SilverDagger() {
    return <IGroupableItem>Item(<IGroupableItem>{
        name: 'Silver Dagger',
        description: description,
        damage: '1d4',
        damageSpecial: (game, enemy, damage) => specialDamage(game, enemy, damage, Spectre, '1d4', 'silver'),
        speed: 3,
        equipmentType: [Constants.PrimaryWeapon, Constants.SecondaryWeapon],
        value: 25,
        attackText: '{0} thrusts the Silver Dagger',
        itemClass: [ClassType.Rogue],
        targetType: TargetType.Enemy,
        isGroupable: true,
        groupName: 'Double Silver Daggers',
        groupTypes: [Dagger],
        maxSize: 2
    });
}