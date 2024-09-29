import { TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Dagger.html?raw';
import { Constants } from '../constants';
import { Item } from '../types';
import {IGroupableItem} from "../interfaces/item.ts";
import {SilverDagger} from "./SilverDagger.ts";

export function Dagger() {
    return <IGroupableItem>Item(<IGroupableItem>{
        name: 'Dagger',
        description: description,
        damage: '1d4',
        speed: 3,
        equipmentType: [Constants.PrimaryWeapon, Constants.SecondaryWeapon],
        value: 5,
        attackText: '{0} thrust the Dagger',
        itemClass: [ClassType.Rogue, ClassType.Warrior],
        targetType: TargetType.Enemy,
        isGroupable: true,
        groupName: 'Double Daggers',
        groupTypes: [SilverDagger],
        maxSize: 2
    });
}