import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './ColdIronAxe.html';
import { IEnemy, IGame } from '../types';
import { equals } from 'storyScript/utilities';
import { ShadowDog } from '../enemies/ShadowDog';

export function ColdIronAxe() {
    return Item({
        name: 'Cold Iron Axe',
        description: description,
        damage: '1D6',
        damageBonus: (game: IGame, enemy: IEnemy) => {
            if (equals(enemy, ShadowDog)) {
                return game.helpers.rollDice('1d6')
            }

            return 0;
        },
        equipmentType: [EquipmentType.RightHand, EquipmentType.LeftHand],
        value: 5,
        attackText: 'You swing your battle axe',
        itemClass: ClassType.Warrior
    });
}