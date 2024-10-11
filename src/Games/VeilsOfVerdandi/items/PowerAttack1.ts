import {IEnemy, IGame, IItem, Item} from '../types';
import {ICharacter, TargetType} from 'storyScript/Interfaces/storyScript';
import description from './PowerAttack1.html?raw';
import {getTopWeapon} from "../sharedFunctions.ts";

export function PowerAttack1() {
    return Item({
        name: 'Power Attack 1',
        description: description,
        equipmentType: 'Special',
        // This special uses the speed of the weapon it is applied to.
        speed: 0,
        targetType: TargetType.Enemy,
        canDrop: false,
        power: '1d4',
        use(game: IGame, character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void {
            const weapon = getTopWeapon(character);
            const weaponDamage = game.helpers.rollDice(weapon.damage);
            const powerAttackDamage = game.helpers.rollDice(item.power);
            const totalDamage = Math.max(0, weaponDamage + powerAttackDamage + game.helpers.calculateBonus(character, 'damageBonus') - (target.defence ?? 0));

            game.logToCombatLog(`${character.name} does a power attack with the ${weapon.name}.`);

            if (!totalDamage) {
                game.logToCombatLog(`${character.name} misses ${target.name}!`);
            } else {
                target.currentHitpoints -= totalDamage;
                game.logToCombatLog(`${character.name} does ${totalDamage} damage to ${target.name}!`);
            }

            item.selectable = false;
        },
        unequip(character: ICharacter, item: IItem, game: IGame): boolean {
            return false;
        }
    });
}