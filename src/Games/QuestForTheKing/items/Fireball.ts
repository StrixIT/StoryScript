import { EquipmentType, GameState, PlayState } from 'storyScript/Interfaces/storyScript';
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
        isWeapon: true,
        attackText: '{0}} casts fireball',
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game, character, item, target) {
            target.hitpoints -= game.helpers.rollDice('1d6');
        },
    });
}