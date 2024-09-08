import {EquipmentType, PlayState, TargetType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './Magicshield.html?raw';
import {Character, Item} from '../types';

export function Magicshield() {
    return Item({
        name: 'Magic Shield Spell',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        value: 15,
        speed: 5,
        recharge: 1,
        arcane: true,
        targetType: TargetType.AllyOrSelf,
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game, character: Character, item, target) {
            character.spellDefence += 2;
        },
    });
}