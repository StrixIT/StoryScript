import { EquipmentType, PlayState } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Frostbite.html';
import { Item } from '../types';

export function Frostbite() {
    return Item({
        name: 'Frostbite Spell',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Miscellaneous,
        value: 5,
        attackText: 'You cast your frostbite',
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game, item, target) {
            target.hitpoints -= game.helpers.rollDice('1d4');
            target.frozen = true;
        },
    });
}