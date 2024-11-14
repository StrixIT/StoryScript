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

export class CombatService implements ICombatService {
    constructor(private readonly _game: IGame, private readonly _rules: IRules, private readonly _texts: IInterfaceTexts) {
    }
    
    initCombat = (): void => {
        this._game.playState = PlayState.Combat;
        this._rules.combat?.initCombat?.(this._game, this._game.currentLocation);
        this.initCombatRound(true);
        this._game.combat.enemies.forEach(enemy => enemy.onAttack?.(this._game));
    }

    fight = (combatRound: ICombatSetup<ICombatTurn>, retaliate?: boolean): Promise<void> | void => {
        if (!this._rules.combat?.fight) {
            return;
        }

        const promise = this._rules.combat.fight(this._game, combatRound, retaliate);

        return Promise.resolve(promise).then(() => {
            combatRound.forEach((s, i) => {
                if (s.target?.currentHitpoints <= 0 && s.targetDefeated) {
                    this.enemyDefeated(this._game.party.characters[i], s.target);
                }
            });

            if (this._game.party.characters.filter(c => c.currentHitpoints > 0).length == 0) {
                this._game.playState = null;
                this._game.state = GameState.GameOver;
            }

            if (combatRound.enemies.filter(c => c.currentHitpoints >= 0).length == 0) {
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

            this._game.currentLocation.activeEnemies.forEach(e =>{
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
            const items = c.combatItems ?? [];

            Object.keys(c.equipment).forEach(k => {
                const item = <IItem>c.equipment[k];

                if ((item?.useInCombat || item?.targetType) && items.indexOf(item) === -1) {
                    items.push(item)
                }
            });

            items.sort((a: IItem, b: IItem) => b.targetType?.localeCompare(a.targetType) || a.name.localeCompare(b.name));

            // Remember the last item used and enemy attacked and select them when they are still valid.
            let previousItem = this._game.combat[i]?.item;
            previousItem = this.isSelectable(previousItem) ? previousItem : undefined;
            const newItem = (previousItem && items.find(i => i === previousItem)) ?? items.filter(i => this.isSelectable(i))[0];
            const targetType = newItem?.targetType ?? TargetType.Enemy;
            const targets = targetType === TargetType.Enemy ? enemies : allies;
            const previousTarget = this._game.combat[i]?.target;
            let newTarget = newItem === previousItem && previousTarget ? targets.find(i => i === previousTarget) : undefined;
            newTarget ??= targets[0];

            this._game.combat[i] = <ICombatTurn>{
                character: c,
                targetsAvailable: enemies.concat(allies),
                target: newTarget,
                itemsAvailable: items,
                item: newItem
            };
        });

        this._rules.combat?.initCombatRound?.(this._game, this._game.combat);
    }
    
    private readonly getTargetName = (enemiesPerType: Record<string, number[]>, target: any): string => {
        const ofSameType = enemiesPerType[target.id];

        if (ofSameType.length === 1) {
            return target.name;
        }

        return this._texts.format(this._texts.enemyCombatName, [target.name, target.index.toString()]);
    }

    private readonly enemyDefeated = (character: ICharacter, enemy: IEnemy): void => {
        if (enemy.items) {
            const items = [...enemy.items];

            items.forEach((item: IItem) => {
                if (!this._rules.combat?.beforeDrop || this._rules.combat.beforeDrop(this._game, character, enemy, item)) {
                    enemy.items.delete(item);
                    this._game.currentLocation.items.add(item);
                }
            });
        }

        if (enemy.currency) {
            this._game.party.currency ??= 0;
            this._game.party.currency += enemy.currency || 0;
        }

        this._game.statistics.enemiesDefeated ??= 0;
        this._game.statistics.enemiesDefeated += 1;
        this._game.currentLocation.enemies.delete(enemy.id);
        this._rules.combat?.enemyDefeated?.(this._game, character, enemy);
        enemy.onDefeat?.(this._game);
    }
}