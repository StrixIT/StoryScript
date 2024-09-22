import { EquipmentType, GameState, PlayState, TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Fireball.html?raw';
import { Item } from '../types';

export function Fireball() {
    return Item({
        name: 'Fireball Spell',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        speed: 7,
        recharge: 2,
        value: 50,
        targetType: TargetType.Enemy,
        attackText: '{0}} casts Fireball',
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game, character, item, target) {
            const damage = game.helpers.rollDice('1d6');
            target.currentHitpoints = Math.max(0, target.currentHitpoints - damage);
            game.logToCombatLog(`${character.name} casts Fireball.`);
            game.logToCombatLog(`${character.name} does ${damage} damage to ${target.name}!`);
        },
    });
}