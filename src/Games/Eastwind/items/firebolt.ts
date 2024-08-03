import description from './firebolt.html';
import {IEquipment, IGame, IItem, Item} from '../types';
import {PlayState} from 'storyScript/Interfaces/storyScript';
import {castCombatSpell} from '../helpers';

export function Firebolt() {
    return Item({
        name: 'Firebolt',
        description: description,
        equipmentType: 'Spell',
        attackText: 'You cast Firebolt...',
        attackSound: 'swing3.wav',
        isSpell: true,
        combatOnly: true,
        damage: '1d8',
        canUse: (game: IGame, character, item: IItem): boolean => item.combatOnly ? game.playState == PlayState.Combat : true,
        useInCombat: (item: IItem, equipment: IEquipment) => {
            return equipment.spell === item;
        },
        use: castCombatSpell
    });
}