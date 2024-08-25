import { EquipmentType, PlayState, TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Frostbite.html?raw';
import { IEnemy, Item } from '../types';

export function Frostbite() {
    return Item({
        name: 'Frostbite Spell',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Miscellaneous,
        value: 5,
        targetType: TargetType.Enemy,
        attackText: '{0} casts frostbite',
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game, character, item, target: IEnemy) {
            target.currentHitpoints -= game.helpers.rollDice('1d4');
            target.frozen = true;
        },
    });
}