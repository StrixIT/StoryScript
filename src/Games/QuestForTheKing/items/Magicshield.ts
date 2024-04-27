import { EquipmentType, PlayState } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Magicshield.html';
import { IGame, Item } from '../types';

export function Magicshield() {
    return Item({
        name: 'Magic Shield Spell',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Miscellaneous,
        value: 15,
        itemClass: ClassType.Wizard,
        canDrop: false,
        useInCombat: true,
        canUse(game, item) {
            return game.playState === PlayState.Combat;
        },
        use(game: IGame, item, target) {
            game.activeCharacter.spellDefence += 2;
        },
    });
}