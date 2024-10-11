import {EquipmentType, PlayState, TargetType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './Magicshield.html?raw';
import {Character, IGame, IItem, Item} from '../types';

export function ForceField() {
    return Item({
        name: 'Force Field Spell',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        value: 15,
        speed: 5,
        recharge: 1,
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        targetType: TargetType.AllyOrSelf,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        canTarget(game: IGame, item: IItem, target: Character): boolean {
            return target.defenseBonus === 0;
        },
        use(game, character, item, target: Character) {
            target.defenseBonus = 1;
        },
    });
}