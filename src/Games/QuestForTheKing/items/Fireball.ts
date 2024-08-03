import { EquipmentType, GameState, PlayState, TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Fireball.html';
import { Item } from '../types';

export function Fireball() {
    return Item({
        name: 'Fireball Spell',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        speed: 7,
        recharge: 2,
        value: 5,
        targetType: TargetType.Enemy,
        attackText: '{0}} casts fireball',
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game, character, item, target) {
            target.currentHitpoints -= game.helpers.rollDice('1d6');
        },
    });
}