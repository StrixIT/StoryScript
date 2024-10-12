import {EquipmentType, ICharacter, TargetType} from 'storyScript/Interfaces/storyScript';
import description from './GoldNecklace.html?raw';
import {ClassType} from '../classType';
import {Character, IGame, IItem, Item} from '../types';
import {heal} from "../sharedFunctions.ts";

export function GoldNecklace() {
    return Item({
        name: 'Golden Necklace',
        description: description,
        equipmentType: EquipmentType.Amulet,
        speed: 7,
        itemClass: [ClassType.Rogue, ClassType.Warrior, ClassType.Wizard],
        targetType: TargetType.AllyOrSelf,
        activeNight: true,
        useInCombat: true,
        canTarget(game: IGame, item: IItem, target: ICharacter): boolean {
            return target.currentHitpoints < target.hitpoints;
        },
        use(game, character, item, target: Character) {
            game.logToCombatLog(`${character.name} uses the Golden Necklace to heal ${target.name}.`);
            heal(target, 3);
        },
    });
}