import {IGame} from "./interfaces/game.ts";
import {ICombatSetup} from "./interfaces/combatRound.ts";
import {IEnemy} from "./interfaces/enemy.ts";
import {Character} from "./character.ts";
import {format} from "storyScript/defaultTexts.ts";
import {TargetType} from "storyScript/Interfaces/enumerations/targetType.ts";
import {descriptionSelector} from "./sharedFunctions.ts";
import {ICombatRules} from "storyScript/Interfaces/rules/combatRules.ts";

export const combatRules = <ICombatRules>{
    initCombatRound: (game: IGame, combat: ICombatSetup): void => {
        if (useBows(combat)) {
            filterBows(combat, i => i.ranged);
            combat.noActionText = 'No bow';

        } else {
            filterBows(combat, i => !i.ranged);
        }

        combat.roundHeader = combat.round === 1 ? 'Archery round' : combat.roundHeader;
    },
    fight: (game: IGame, combatSetup: ICombatSetup): void => {
        game.combatLog = [];

        // First, determine the order of the round.
        const participants = <any>game.party.characters.concat(<any>game.currentLocation.activeEnemies);
        const orderedParticipants = participants.sort((a, b) => {
            const a_speed = getCombatSpeed(a, combatSetup);
            const b_speed = getCombatSpeed(b, combatSetup);
            return a_speed - b_speed;
        });

        for (let i in orderedParticipants) {
            const participant = orderedParticipants[i];
            const enemy = participant.type === 'enemy' ? <IEnemy>participant : undefined;
            const character = typeof enemy === 'undefined' ? <Character>participant : undefined;

            if (character) {
                const setupEntry = combatSetup.find(e => e.character === character);
                const combatItem = setupEntry.item;
                const target = setupEntry.target;

                if (!combatItem) {
                    return;
                }

                let combatText = format(combatItem.attackText, [character.name]);
                let totalDamage = 0;

                if (combatItem.use) {
                    combatItem.use(game, character, combatItem, target);
                } else if (combatItem.targetType === TargetType.Enemy) {
                    const weaponDamage = game.helpers.rollDice(combatItem.damage);
                    totalDamage = Math.max(0, weaponDamage + game.helpers.calculateBonus(character, 'damageBonus') - (target.defence ?? 0));
                    target.currentHitpoints -= totalDamage;

                    if (combatText) {
                        game.logToCombatLog(combatText + '.');
                    }

                    game.logToCombatLog(`${character.name} does ${totalDamage} damage to ${target.name}!`);
                }

                if (target.currentHitpoints <= 0) {
                    game.logToCombatLog(`${character.name} defeats ${target.name}!`);

                    if (!game.currentLocation.activeEnemies.some(target => target.currentHitpoints > 0)) {
                        const currentSelector = descriptionSelector(game);
                        let selector = currentSelector ? currentSelector + 'after' : 'after';
                        selector = game.currentLocation.descriptions[selector] ? selector : 'after';
                        game.currentLocation.descriptionSelector = selector;
                        game.playState = null;
                        return;
                    }
                }

                continue;
            }

            if (useBows(combatSetup)) {
                continue;
            }

            // Determine the enemy target using the enemy's attack priority.
            const potentialTargets = game.party.characters.filter(c => c.currentHitpoints > 0);
            const enemyAttackPriorityRoll = game.helpers.rollDice('1d6');
            let enemyTargetType = enemy.attackPriority.find(a => a[1].indexOf(enemyAttackPriorityRoll) > -1)[0];
            let enemyTarget: Character;

            // If no target is found using the attack priority, pick one at random.
            if (!enemyTargetType) {
                const targetDie = `1d${potentialTargets.length}`;
                enemyTarget = potentialTargets[game.helpers.rollDice(targetDie) - 1];
            } else {
                enemyTarget = potentialTargets.find(t => t.class.name === enemyTargetType);
            }

            const characterDefense = game.helpers.calculateBonus(enemyTarget, 'defense');
            const enemyDamage = game.helpers.rollDice(enemy.damage) + game.helpers.calculateBonus(enemy, 'damageBonus');
            const totalDamage = Math.max(0, enemyDamage - characterDefense);
            game.logToCombatLog(`${enemy.name} does ${totalDamage} damage to ${enemyTarget.name}!`);
            enemyTarget.currentHitpoints -= totalDamage;
        }
    }
}

function useBows(combat: ICombatSetup): boolean {
    let useBows = false;

    if (combat.round === 1) {
        for (const turn of combat) {
            if (turn.itemsAvailable.filter(i => i.ranged).length > 0) {
                useBows = true;
                break;
            }
        }
    }

    return useBows;
}

function filterBows(combat: ICombatSetup, filter: any): void {
    combat.forEach(c => {
        const filteredItems = c.itemsAvailable.filter(filter);
        c.itemsAvailable = filteredItems;
        c.item = c.itemsAvailable[0];

        if (!c.item) {
            c.targetsAvailable = null;
            c.target = null;
        }
    });
}

function getCombatSpeed(entry: any, combatSetup: ICombatSetup): number {
    if (entry.type === 'enemy') {
        return entry.speed;
    } else {
        const setupEntry = combatSetup.find(e => e.character === entry);
        return setupEntry.item?.speed;
    }
}