import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './ColdIronAxe.html';
import { IEnemy, IGame } from '../types';
import { equals } from 'storyScript/utilityFunctions';
import { ShadowDog } from '../enemies/ShadowDog';
import { Constants } from '../constants';

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
        equipmentType: Constants.PrimaryWeapon,
        value: 5,
        attackText: '{0}} swings the battle axe',
        itemClass: ClassType.Warrior
    });
}