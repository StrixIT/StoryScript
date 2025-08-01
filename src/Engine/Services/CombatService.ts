import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ICombatSetup} from "storyScript/Interfaces/combatSetup.ts";
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {GameState} from "storyScript/Interfaces/enumerations/gameState.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {TargetType} from "storyScript/Interfaces/enumerations/targetType.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {ICombatService} from "storyScript/Interfaces/services/combatService.ts";
import {StateProperties} from "storyScript/stateProperties.ts";
import {addUniqueId} from "storyScript/arrayAndFunctionExtensions.ts";

export class CombatService implements ICombatService {
    constructor(private readonly _game: IGame, private readonly _rules: IRules, private readonly _texts: IInterfaceTexts) {
    }
    
    initCombat = (): void => {
        this._rules.combat?.initCombat?.(this._game, this._game.currentLocation);
        this.initCombatRound(true);
        this._game.playState = PlayState.Combat;
        this._game.combat.enemies.forEach(enemy => enemy.onAttack?.(this._game, enemy));
    }

    fight = (combat: ICombatSetup<ICombatTurn>, retaliate?: boolean): Promise<void> | void => {
        if (!this._rules.combat?.fight) {
            return;
        }

        const promise = this._rules.combat.fight(this._game, combat, retaliate);

        return Promise.resolve(promise).then(() => {
            combat.forEach((s, i) => {
                if (s.target?.currentHitpoints <= 0 && (s.targetDefeated === undefined || s.targetDefeated)) {
                    this.enemyDefeated(combat, this._game.party.characters[i], s.target);
                }
            });

            if (this._game.party.characters.filter(c => c.currentHitpoints > 0).length == 0) {
                this._game.playState = null;
                this._game.state = GameState.GameOver;
            }

            if (combat.enemies.filter(c => c.currentHitpoints >= 0).length == 0) {
                return;
            }

            this.initCombatRound(false);
        });
    }

    isSelectable = (item: IItem): boolean => item?.selectable || typeof item?.selectable === 'undefined';

    canTarget = (item: IItem, target: IEnemy | ICharacter, character: ICharacter) => {
        const type = (<any>target).type;
        let canTarget = false;

        if (type === 'enemy') {
            canTarget = item.targetType === TargetType.Enemy;
        } else {
            switch (item.targetType) {
                case TargetType.Ally:
                    canTarget = target !== character;
                    break;
                case TargetType.Self:
                    canTarget = target === character;
                    break;
                case TargetType.AllyOrSelf:
                    canTarget = true;
                    break;
            }
        }

        if (!canTarget || !item.canTarget) {
            return canTarget;
        }

        return item.canTarget(this._game, item, target);
    }
    
    private readonly initCombatRound = (newFight: boolean) => {
        this._game.combat = newFight ? <ICombatSetup<ICombatTurn>>[] : this._game.combat;

        if (!this._game.combat.enemies) {
            this._game.combat.enemies = [];

            const enemiesPerType = <Record<string, number[]>>{};

            this._game.currentLocation.activeEnemies.forEach((e: any, i) => {
                enemiesPerType[e.id] ??= [];
                e.index = enemiesPerType[e.id].length + 1;
                enemiesPerType[e.id].push(i);
            });

            this._game.currentLocation.activeEnemies.forEach(e => {
                // Add a unique id here so we can track multiple enemies of the same type.
                // Combat will end only when the enemies are defeated, at which point they will
                // be assigned a unique id anyway.
                addUniqueId(e);
                const name = this.getTargetName(enemiesPerType, e);
                const copy = {...e};
                copy.name = name;
                copy.currentHitpoints = copy.hitpoints;
                this._game.combat.enemies.push(copy);
            });
        }

        this._game.combat.round = newFight ? 1 : ++this._game.combat.round;
        this._game.combat.roundHeader = this._texts.format(this._texts.combatRound, [this._game.combat.round.toString()]);
        this._game.combat.noActionText = this._texts.noCombatAction;
        const enemies = this._game.combat.enemies = this._game.combat.enemies.filter(e => e.currentHitpoints > 0);
        const characters = this._game.combat.characters = this._game.party.characters;

        characters.forEach((c, i) => {
            const allies = characters.filter(a => a != c);
            const items = this.getItems(c, enemies, allies);

            // Remember the last item used and enemy attacked and select them when they are still valid.
            let previousItem = this._game.combat[i]?.item;
            previousItem = this.isSelectable(previousItem) ? previousItem : undefined;
            const previousTarget = this._game.combat[i]?.target; 
            let newItem = (previousItem && items.find(i => i === previousItem)) ?? items.filter(i => this.isSelectable(i))[0];
            let { targets, newTarget } = this.getTarget(newItem, enemies, allies, previousTarget, previousItem);
            
            if (!newTarget) {
                newItem = items.filter(i => this.isSelectable(i) && (!i.canTarget || (newTarget && i.canTarget(this._game, newItem, newTarget))))[0];
                ({ targets, newTarget } = this.getTarget(newItem, enemies, allies, this._game.combat[i]?.target, previousItem));
                newTarget ??= targets[0];
            }

            this._game.combat[i] = <ICombatTurn>{
                character: c,
                targetsAvailable: enemies.concat(allies),
                previousTarget: previousTarget,
                target: newTarget,
                itemsAvailable: items,
                previousItem: previousItem,
                item: newItem
            };
        });

        this._rules.combat?.initCombatRound?.(this._game, this._game.combat);
    }
    
    private readonly getItems = (character: ICharacter, enemies: IEnemy[], allies: ICharacter[]) => {
        const items = character.combatItems ?? [];

        Object.keys(character.equipment).forEach(k => {
            const item = <IItem>character.equipment[k];

            if ((item?.useInCombat || item?.targetType) && items.indexOf(item) === -1) {
                items.push(item)
            }
        });

        items.forEach(i => {
            if (!i.canTarget) {
                return;
            }

            i.selectable = false;
            const targets = i.targetType === TargetType.Enemy ? enemies : allies;

            for (let x = 0; x < targets.length; x++) {
                const target = targets[x];
                if (i.canTarget(this._game, i, target)) {
                    i.selectable = true;
                    return;
                }
            }
        });

        items.sort((a: IItem, b: IItem) => b.targetType?.localeCompare(a.targetType) || a.name.localeCompare(b.name));
        return items;
    }
    
    private readonly getTarget = 
        (newItem: IItem, enemies: IEnemy[], allies: ICharacter[], previousTarget: IEnemy | ICharacter, previousItem?: IItem): 
            { targets: IEnemy[] | ICharacter[], newTarget?: IEnemy | ICharacter } => {
        let targetType = newItem?.targetType ?? TargetType.Enemy;
        let targets = targetType === TargetType.Enemy ? enemies : allies;
        let newTarget = newItem === previousItem && previousTarget ?
            targets.find(i => i === previousTarget && (!newItem.canTarget || newItem.canTarget(this._game, newItem, i)))
            : undefined;
        return { targets, newTarget };
    }
    
    private readonly getTargetName = (enemiesPerType: Record<string, number[]>, target: any): string => {
        const ofSameType = enemiesPerType[target.id];

        if (ofSameType.length === 1) {
            return target.name;
        }

        return this._texts.format(this._texts.enemyCombatName, [target.name, target.index.toString()]);
    }

    private readonly enemyDefeated = (combat: ICombatSetup<ICombatTurn>, character: ICharacter, enemy: IEnemy): void => {
        combat.winnings ??= {
            currency: 0,
            itemsWon: [],
            enemiesDefeated: []
        };
        
        if (enemy.items) {
            const items = [...enemy.items];

            items.forEach((item: IItem) => {
                if (!this._rules.combat?.beforeDrop || this._rules.combat.beforeDrop(this._game, character, enemy, item)) {
                    enemy.items.delete(item);
                    this._game.currentLocation.items.add(item);
                    combat.winnings.itemsWon.push(item);
                }
            });
        }

        if (enemy.currency) {
            this._game.party.currency ??= 0;
            this._game.party.currency += enemy.currency || 0;
            combat.winnings.currency += enemy.currency || 0;
        }

        this._game.statistics.enemiesDefeated ??= 0;
        this._game.statistics.enemiesDefeated += 1;
        combat.winnings.enemiesDefeated.push(enemy);
        this._game.currentLocation.enemies.delete(enemy[StateProperties.Id]);
        this._rules.combat?.enemyDefeated?.(this._game, character, enemy);
        enemy.onDefeat?.(this._game, enemy);
    }
}