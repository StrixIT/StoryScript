﻿import {EquipmentType, PlayState, TargetType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './MagicShield.html?raw';
import {Character, IGame, IItem, Item} from '../types';

export function MagicShield() {
    return Item({
        name: 'Magic Shield Spell',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        speed: 5,
        recharge: 1,
        targetType: TargetType.AllyOrSelf,
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        canTarget(game: IGame, item: IItem, target: Character): boolean {
            return target.spellDefence === 0;
        },
        use(game, character, item, target: Character) {
            game.logToCombatLog(`${character.name} casts Magic Shield on ${target.name}.`);
            target.spellDefence = 2;
        },
    });
}