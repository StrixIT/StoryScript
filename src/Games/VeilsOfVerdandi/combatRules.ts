import {IGame} from "./interfaces/game.ts";
import {ICombatSetup} from "./interfaces/combatSetup.ts";
import {IEnemy, IEnemyAttack} from "./interfaces/enemy.ts";
import {Character} from "./character.ts";
import {format} from "storyScript/defaultTexts.ts";
import {TargetType} from "storyScript/Interfaces/enumerations/targetType.ts";
import {check, descriptionSelector, getTopWeapon} from "./sharedFunctions.ts";
import {ICombatRules} from "storyScript/Interfaces/rules/combatRules.ts";
import {IGroupableItem, IItem} from "./interfaces/item.ts";
import {ICombatTurn} from "./interfaces/combatTurn.ts";
import {ClassType} from "./classType.ts";
import {CombatParticipant} from "./interfaces/combatParticipant.ts";
import {equals} from "storyScript/utilityFunctions.ts";
import {Constants} from "./constants.ts";

export const damageSpecial = (game: IGame, enemy: IEnemy, character: Character, property: string, checkDifficulty?: number) => {
    if (!checkDifficulty || !check(game, checkDifficulty)) {
        character[property] = true;
        game.logToCombatLog(`${character.name} is ${property} by the ${enemy.name}\`s attack!`)
    }
};

export const specialDamage = (game: IGame, enemy: IEnemy, damage: number, enemyType: (() => IEnemy), bonus: string, damageType: string) => {
    if (equals(enemy, enemyType)) {
        const additionalDamage = game.helpers.rollDice(bonus);
        let extraDamage = damage < 0 ? Math.max(additionalDamage + damage, 0) : additionalDamage;

        if (extraDamage > 0) {
            enemy.currentHitpoints = Math.max(enemy.currentHitpoints - extraDamage, 0);
        }

        return {
            extraDamage: extraDamage,
            text: `The ${damageType} does an additional ${extraDamage} to the ${enemy.name}!`
        };
    }

    return {};
}

export const combatRules = <ICombatRules>{
    isTargeted(game: IGame, participant: Character) {
        const enemyNames = (<ICombatSetup>game.combat).enemyTargets?.filter(t => t.length === 2 && t[1].find(e => e === participant));
        let result = '';

        if (enemyNames?.length > 0) {
            enemyNames.forEach((t, i) => result += i > 0 ? ` and ${t[0].name}` : t[0].name);
            result = `${participant.name} is targeted by ${result}!`;
        }

        return result;
    },

    initCombat(game: IGame) {
        game.party.characters.forEach(c => {
            // Reset all combat-specific states.
            c.defenseBonus = 0;
            c.spellDefence = 0;
            c.frightened = false;
            c.frozen = false;
            c.confused = false;
            c.items.forEach(i => delete i.selectable);

            Object.keys(c.equipment).forEach(k => {
                const item = <IItem>c.equipment[k];

                if (item?.selectable !== undefined) {
                    delete item.selectable;
                }
            });
        });
    },

    initCombatRound: (game: IGame, combatSetup: ICombatSetup): void => {
        if (!combatSetup.enemies.length) {
            return;
        }

        setEffects(combatSetup);

        if (combatSetup.round > 1) {
            getEnemyTargets(game, combatSetup);
        }

        if (useBows(combatSetup)) {
            filterWeapons(combatSetup, (s, c, i) => i.ranged);
            combatSetup.noActionText = 'No bow';

        } else {
            filterWeapons(combatSetup, (s, c, i) => !s.enemyTargets.find(t => t[1].find(e => e === c)) || !i.ranged);
        }

        combatSetup.roundHeader = combatSetup.round === 1 ? 'Archery round' : combatSetup.roundHeader;
    },

    fight: (game: IGame, combatSetup: ICombatSetup): void => {
        game.combatLog = [];
        const orderedParticipants = getOrderedParticipants(game, combatSetup);

        for (let i in orderedParticipants) {
            const entry = orderedParticipants[i];
            const enemy = (<any>entry.participant).type === 'enemy' ? <IEnemy>entry.participant : undefined;
            const character = typeof enemy === 'undefined' ? <Character>entry.participant : undefined;

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

            const enemyTarget = combatSetup.enemyTargets.find(e => e[0] === enemy)[1][entry.attackIndex];
            executeEnemyTurn(game, combatSetup, enemy, entry.attack, enemyTarget);
        }

        game.combatLog.reverse();
    }
}

function setEffects(combatSetup: ICombatSetup): void {
    combatSetup.enemies.forEach(e => e.effects = buildEffectArray(e));
    combatSetup.characters.forEach(c => c.effects = buildEffectArray(c));
}

function buildEffectArray(participant: IEnemy | Character): { name: string, description: string }[] {
    const effects: { name: string, description: string }[] = [];

    if (participant.frozen) {
        effects.push({ name: 'Frozen', description: Constants.CombatEffects['Frozen'] });
    }

    if (participant.frightened) {
        effects.push({ name: 'Frightened', description: Constants.CombatEffects['Frightened'] });
    }

    if (participant.confused) {
        effects.push({ name: 'Confused', description: Constants.CombatEffects['Confused'] });
    }

    if ((participant as Character).defenseBonus) {
        effects.push({ name: 'Force Field', description: Constants.CombatEffects['Force Field'] });
    }

    if ((participant as Character).spellDefence) {
        effects.push({ name: 'Magic Shield', description: Constants.CombatEffects['Magic Shield'] });
    }

    return effects;
}

function getOrderedParticipants(game: IGame, combatSetup: ICombatSetup): CombatParticipant[] {
    // First, determine the order of the round.
    const enemyTurns = <CombatParticipant[]>[];

    combatSetup.enemies.forEach(e => {
        e.attacks.forEach((a, i) => {
            enemyTurns.add({participant: e, attack: a, attackIndex: i})
        });
    })

    const participants = combatSetup.characters.filter(c => c.currentHitpoints > 0).map(c => {
        return <CombatParticipant>{participant: c, attack: undefined};
    }).concat(enemyTurns);

    participants.sort((a, b) => {
        a.combatSpeed = getCombatSpeed(a, combatSetup) ?? 0;
        b.combatSpeed = getCombatSpeed(b, combatSetup) ?? 0;
        return a.combatSpeed - b.combatSpeed;
    });

    // Frozen lasts only one turn, delete it after determining the combat order.
    participants.forEach(p => delete p.participant.frozen);

    if (combatSetup.round > 1) {
        game.logToCombatLog('Combat order: ' + participants.reduce((c: string, p, i: number, a) => {
            if (p.combatSpeed === 0) {
                return c;
            }

            const separator = a.length === i + 1 ? ').' : '), ';
            return c + p.participant.name + ' (speed ' + p.combatSpeed + separator;
        }, ''));
    }

    return participants;
}

function getEnemyTargets(game: IGame, combatSetup: ICombatSetup) {
    const enemyTargets: [IEnemy, Character[]][] = [];

    combatSetup.enemies.forEach(e => {
        const targets = <Character[]>[];

        e.attacks.forEach(a => {
            // Determine the enemy target using the enemy's attack priority.
            const potentialTargets = combatSetup.characters.filter(c => c.currentHitpoints > 0);
            const enemyAttackPriorityRoll = game.helpers.rollDice('1d6');
            let enemyTargetType = a.attackPriority?.find(a => a[1].indexOf(enemyAttackPriorityRoll) > -1)[0];
            let enemyTarget = enemyTargetType ? potentialTargets.find(t => t.class.name === enemyTargetType) : null;

            // If no target is found using the attack priority, pick one at random.
            if (!enemyTarget) {
                const targetDie = `1d${potentialTargets.length}`;
                enemyTarget = potentialTargets[game.helpers.rollDice(targetDie) - 1];
            }

            targets.push(enemyTarget);
        });

        enemyTargets.push([e, targets]);
    });

    combatSetup.enemyTargets = enemyTargets;
}

function executeCharacterTurn(game: IGame, turn: ICombatTurn) {
    if (!turn.target || turn.character.currentHitpoints <= 0 || (turn.item.targetType === TargetType.Enemy && turn.target.currentHitpoints <= 0)) {
        return;
    }

    if (turn.item.use) {
        turn.item.use(game, turn.character, turn.item, turn.target);

        if (turn.item.recharge) {
            (<any>turn.item).recharging = turn.item.recharge;
            turn.item.selectable = false;
        }
    } else if (turn.item.targetType === TargetType.Enemy) {
        const groupable = <IGroupableItem>turn.item;
        const attacks = groupable?.members?.length > 0 ? 2 : 1;

        for (let a = 0; a < attacks; a++) {
            const item = a === 0 ? turn.item : groupable.members[a - 1] as IItem;
            let totalDamage = 0;
            let combatText = format(item.attackText, [turn.character.name]);
            let weaponDamage = game.helpers.rollDice(item.damage) + game.helpers.calculateBonus(turn.character, 'damageBonus');
            weaponDamage = turn.character.confused ? Math.ceil(weaponDamage / 2) : weaponDamage;
            const damageAfterDefence = weaponDamage - (turn.target.defence ?? 0);
            totalDamage = Math.max(0, damageAfterDefence);
            const specialDamage = item.damageSpecial?.(game, turn.target, damageAfterDefence);

            if (combatText) {
                game.logToCombatLog(combatText + '.');
            }

            if (totalDamage + (specialDamage?.extraDamage ?? 0) <= 0) {
                game.logToCombatLog(`${turn.character.name} misses ${turn.target.name}!`);
                continue;
            }

            turn.target.currentHitpoints = Math.max(0, turn.target.currentHitpoints - totalDamage);
            game.logToCombatLog(`${turn.character.name} does ${totalDamage} damage to ${turn.target.name}!`);

            if (specialDamage?.text) {
                game.logToCombatLog(specialDamage.text);
            }
        }

        // Confusion lasts only one turn.
        turn.character.confused = false;
    }
}

function executeEnemyTurn(game: IGame, combatSetup: ICombatSetup, enemy: IEnemy, enemyAttack: IEnemyAttack, target: Character) {
    if (enemy.currentHitpoints <= 0 || target.currentHitpoints <= 0) {
        return;
    }

    let characterDefense: number;

    if (enemyAttack.isMagic) {
        characterDefense = target.spellDefence;
    } else {
        characterDefense = game.helpers.calculateBonus(target, 'defense') + target.defenseBonus;
        characterDefense = target.frightened ? Math.min(1, characterDefense - 1) : characterDefense;
    }

    const enemyDamage = game.helpers.rollDice(enemyAttack.damage) + game.helpers.calculateBonus(enemy, 'damageBonus');
    let totalDamage = Math.max(0, enemyDamage - characterDefense);

    if (target.class.name === ClassType.Rogue && target.currentHitpoints / 2 <= totalDamage) {
        const character = combatSetup.find(t => t.character === target).character;
        const special = character.equipment.special;

        if ((special.selectable || typeof special.selectable === 'undefined') && special.id.indexOf('dodge') > -1) {
            const avoidedDamage = Math.ceil(totalDamage * parseFloat(special.power));
            totalDamage = totalDamage - avoidedDamage;
            special.selectable = false;
            game.logToCombatLog(`${character.name} dodges ${avoidedDamage} damage!`);
        }
    }

    if (!totalDamage) {
        game.logToCombatLog(`${enemy.name} misses ${target.name}!`);
        return;
    }

    if (enemyAttack.damageSpecial) {
        enemyAttack.damageSpecial(game, enemy, target);
    }

    game.logToCombatLog(`${enemy.name} does ${totalDamage} damage to ${target.name}!`);
    target.currentHitpoints = Math.max(0, target.currentHitpoints - totalDamage);
}

function checkCombatWin(game: IGame, combatSetup: ICombatSetup, turn: ICombatTurn): boolean {
    if (!turn.target) {
        return false;
    }

    if (turn.target.currentHitpoints <= 0) {
        turn.targetDefeated = true;

        combatSetup.filter(t => t.target === turn.target && t !== turn).forEach(t => t.target = undefined);

        game.logToCombatLog(`${turn.character.name} defeats ${turn.target.name}!`);

        if (!combatSetup.enemies.some(e => e.currentHitpoints > 0)) {
            if (game.currentLocation.isHotspot) {
                game.currentLocation.hotSpotCleared = true;
                return true;
            }

            if (game.worldProperties.isDay) {
                game.currentLocation.encounterWonDay = true;
            } else {
                game.currentLocation.encounterWonNight = true;
            }

            game.delayedDescriptionChanges.push(() => {
                game.currentLocation.description = game.currentLocation.descriptions[descriptionSelector(game)];  
            });
            
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

function filterWeapons(combatSetup: ICombatSetup, filter: (combatSetup: ICombatSetup, character: Character, item: IItem) => boolean): void {
    combatSetup.forEach(c => {
        c.itemsAvailable.forEach((i: any) => {
            if (i.recharging) {
                i.recharging = i.recharging > 1 ? --i.recharging : undefined;
                i.selectable = !i.recharging;
            }

            if (i.id.indexOf('powerattack') > -1) {
                i.speed = getTopWeapon(c.character)?.speed || 0;
            }
            
            if (i.id === 'goldnecklace') {
                i.selectable = combatSetup.find(s => s.character.currentHitpoints < s.character.hitpoints) !== undefined;
            }
        });
        
        const selectedItem = c.item;
        c.itemsAvailable = c.itemsAvailable.filter(i => filter(combatSetup, c.character, i));
        c.item = c.itemsAvailable.find(i => i === selectedItem) ?? c.itemsAvailable[0];

        if (!c.item) {
            c.targetsAvailable = null;
            c.target = null;
        }
        
        if (c.previousItem !== c.item) {
            if (c.character.class.name !== ClassType.Wizard)
            {
                c.item = getTopWeapon(c.character);
            }
            else {
                c.item = c.itemsAvailable.filter((i: any) => !i.recharging).sort((a, b) => a.name.localeCompare(b.name))[0];
            }
        }
    });
}

function getCombatSpeed(entry: CombatParticipant, combatSetup: ICombatSetup): number {
    let baseSpeed = entry.participant.frozen ? 3 : 0;

    if ((<any>entry.participant).type === 'enemy') {
        return baseSpeed + entry.attack.speed;
    } else {
        const setupEntry = combatSetup.find(e => e.character === entry.participant);

        // When using double daggers, the attack speed is 5 instead of three.
        if ((<IGroupableItem>setupEntry.item)?.members?.length > 0) {
            baseSpeed += 2;
        }

        return setupEntry.item ? baseSpeed + setupEntry.item.speed : 0;
    }
}