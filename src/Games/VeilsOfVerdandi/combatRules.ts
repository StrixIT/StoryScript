import {IGame} from "./interfaces/game.ts";
import {ICombatSetup} from "./interfaces/combatRound.ts";
import {IEnemy} from "./interfaces/enemy.ts";
import {Character} from "./character.ts";
import {format} from "storyScript/defaultTexts.ts";
import {TargetType} from "storyScript/Interfaces/enumerations/targetType.ts";
import {descriptionSelector} from "./sharedFunctions.ts";
import {ICombatRules} from "storyScript/Interfaces/rules/combatRules.ts";
import {IItem} from "./interfaces/item.ts";
import {ICombatTurn} from "./interfaces/combatTurn.ts";

export const combatRules = <ICombatRules>{
    initCombatRound: (game: IGame, combatSetup: ICombatSetup): void => {
        getEnemyTargets(game, combatSetup);
        
        if (useBows(combatSetup)) {
            filterBows(combatSetup, (s, c, i) => i.ranged);
            combatSetup.noActionText = 'No bow';

        } else {
            filterBows(combatSetup, (s, c, i) => !s.enemyTargets.find(t => t[1] === c) || !i.ranged);
        }

        combatSetup.roundHeader = combatSetup.round === 1 ? 'Archery round' : combatSetup.roundHeader;
    },
    fight: (game: IGame, combatSetup: ICombatSetup): void => {
        game.combatLog = [];
        logAttackPriority(game, combatSetup);

        const orderedParticipants = getOrderedParticipants(game, combatSetup);

        for (let i in orderedParticipants) {
            const participant = orderedParticipants[i];
            const enemy = participant.type === 'enemy' ? <IEnemy>participant : undefined;
            const character = typeof enemy === 'undefined' ? <Character>participant : undefined;

            if (character) {
                const setupEntry = combatSetup.find(e => e.character === character);

                if (!setupEntry.item) {
                    continue;
                }

                executeCharacterTurn(game, setupEntry);

                if (checkCombatWin(game, combatSetup, setupEntry)) {
                    return;
                }

                continue;
            }

            if (useBows(combatSetup)) {
                continue;
            }

            const enemyTarget = combatSetup.enemyTargets.find(e => e[0] === enemy)[1];
            executeEnemyTurn(game, combatSetup, enemy, enemyTarget);
        }

        game.combatLog.reverse();
    }
}

function logAttackPriority(game: IGame, combatSetup: ICombatSetup) {
    if (combatSetup.round > 1) {
        game.logToCombatLog('Attack priority: ' + combatSetup.enemyTargets.reduce((c: string, p, i: number, a) => {
            const separator = a.length === i + 1 ? '.' : ', ';
            return c + p[0].name + ' - ' + p[1].name + separator;
        }, ''));
    }
}

function getOrderedParticipants(game: IGame, combatSetup: ICombatSetup) {
    // First, determine the order of the round.
    const participants = <any[]>combatSetup.characters.filter(c => c.currentHitpoints > 0).concat(<any>combatSetup.enemies);
    participants.sort((a, b) => {
        a.combatSpeed = getCombatSpeed(a, combatSetup) ?? 0;
        b.combatSpeed = getCombatSpeed(b, combatSetup) ?? 0;
        return a.combatSpeed - b.combatSpeed;
    });

    if (combatSetup.round > 1) {
        game.logToCombatLog('Combat order: ' + participants.reduce((c: string, p, i: number, a) => {
            if (p.combatSpeed === 0) {
                return c;
            }

            const separator = a.length === i + 1 ? ').' : '), ';
            return c + p.name + ' (speed ' + p.combatSpeed + separator;
        }, ''));
    }

    return participants;
}

function getEnemyTargets(game: IGame, combatSetup: ICombatSetup) {
    const enemyTargets: [IEnemy, Character][] = [];

    combatSetup.enemies.forEach(e => {
        // Determine the enemy target using the enemy's attack priority.
        const potentialTargets = combatSetup.characters.filter(c => c.currentHitpoints > 0);
        const enemyAttackPriorityRoll = game.helpers.rollDice('1d6');
        let enemyTargetType = e.attackPriority.find(a => a[1].indexOf(enemyAttackPriorityRoll) > -1)[0];
        let enemyTarget = enemyTargetType ? potentialTargets.find(t => t.class.name === enemyTargetType) : null;

        // If no target is found using the attack priority, pick one at random.
        if (!enemyTarget) {
            const targetDie = `1d${potentialTargets.length}`;
            enemyTarget = potentialTargets[game.helpers.rollDice(targetDie) - 1];
        }

        enemyTargets.push([e, enemyTarget]);
    });

    combatSetup.enemyTargets = enemyTargets;
}

function executeCharacterTurn(game: IGame, turn: ICombatTurn) {
    let combatText = format(turn.item.attackText, [turn.character.name]);
    let totalDamage = 0;

    if (turn.item.use) {
        turn.item.use(game, turn.character, turn.item, turn.target);
    } else if (turn.item.targetType === TargetType.Enemy) {
        const weaponDamage = game.helpers.rollDice(turn.item.damage);
        totalDamage = Math.max(0, weaponDamage + game.helpers.calculateBonus(turn.character, 'damageBonus') - (turn.target.defence ?? 0));
        turn.target.currentHitpoints -= totalDamage;

        if (combatText) {
            game.logToCombatLog(combatText + '.');
        }

        game.logToCombatLog(`${turn.character.name} does ${totalDamage} damage to ${turn.target.name}!`);
    }
}

function executeEnemyTurn(game: IGame, combatSetup: ICombatSetup, enemy: IEnemy, target: Character) {
    const characterDefense = game.helpers.calculateBonus(target, 'defense');
    const enemyDamage = game.helpers.rollDice(enemy.damage) + game.helpers.calculateBonus(enemy, 'damageBonus');
    const totalDamage = Math.max(0, enemyDamage - characterDefense);
    game.logToCombatLog(`${enemy.name} does ${totalDamage} damage to ${target.name}!`);
    target.currentHitpoints -= totalDamage;
}

function checkCombatWin(game: IGame, combatSetup: ICombatSetup, turn: ICombatTurn): boolean {
    if (turn.target.currentHitpoints <= 0) {
        turn.targetDefeated = true;
        
        game.logToCombatLog(`${turn.character.name} defeats ${turn.target.name}!`);

        if (!combatSetup.enemies.some(e => e.currentHitpoints > 0)) {
            const currentSelector = descriptionSelector(game);
            let selector = currentSelector ? currentSelector + 'after' : 'after';
            selector = game.currentLocation.descriptions[selector] ? selector : 'after';
            game.currentLocation.descriptionSelector = selector;
            game.playState = null;
            return true;
        }
    }

    return false;
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

function filterBows(combatSetup: ICombatSetup, filter: (combatSetup: ICombatSetup, character: Character, item: IItem) => boolean): void {
    combatSetup.forEach(c => {
        const selectedItem = c.item;
        c.itemsAvailable = c.itemsAvailable.filter(i => filter(combatSetup, c.character, i));
        c.item = c.itemsAvailable.find(i => i === selectedItem) ?? c.itemsAvailable[0];

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