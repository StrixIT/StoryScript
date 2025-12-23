<template>
  <modal-dialog :canClose="!enemiesPresent"
                :closeButton="true"
                :openState="PlayState.Combat"
                :title="texts.combatTitle">
    <div v-if="enemiesPresent" id="combat" class="row">
      <div class="col-12">
        <h3 class="combat-header">{{ game.combat.roundHeader }}</h3>

        <div v-for="enemyRow of enemyRows" class="row enemy-row">
          <div v-for="enemy of enemyRow"
               :class="[`col-${(12 / enemyRow.length)}`, { 'unavailable': enemy.currentHitpoints <= 0 }]">
            <combat-participant :participant="enemy"></combat-participant>
          </div>
        </div>

        <div v-for="characterRow of characterRows" class="row character-row">
          <div v-for="turn of characterRow"
               :class="[`col-${(12 / characterRow.length)}`, { 'unavailable': turn.character.currentHitpoints <= 0 }]">
            <combat-participant :participant="turn.character"></combat-participant>
            <div v-if="turn.item && turn.character.currentHitpoints > 0">
              <div :class="{ 'not-applicable': !turn.item.targetType }">
                <span>{{ turn.item.targetType === 'Enemy' ? texts.attack : texts.aid }}</span>
                <select v-if="filteredTargets(turn).length > 1" v-model="turn.target" class="custom-select">
                  <option v-for="target of filteredTargets(turn)" :value="target">{{ (target as any).name }}</option>
                </select>
                <input v-if="filteredTargets(turn).length === 1"
                       :disabled="true" :value="turn.target?.name"
                       class="single-item"
                       type="text"/>
              </div>
              <div v-if="turn.itemsAvailable.length">
                <span>{{
                    turn.item.targetType === 'Enemy' ? texts.attackWith : turn.item.targetType ? texts.aidWith : texts.useCombatItem
                  }}</span>
                <select v-if="turn.itemsAvailable.length > 1" v-model="turn.item" class="custom-select"
                        @change="itemChange(turn.item, turn)">
                  <option v-for="item of turn.itemsAvailable" :class="{'unselectable': !itemSelectable(item)}"
                          :disabled="!itemSelectable(item)"
                          :value="item">{{ getItemName(item) }}
                  </option>
                </select>
                <input v-if="turn.itemsAvailable.length === 1" :disabled="true" :value="getItemName(turn.item)"
                       class="single-item"
                       type="text"/>
              </div>
            </div>
            <div v-if="!turn.item && turn.character.currentHitpoints > 0">
              <span>{{ game.combat.noActionText }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12 fight-row">
            <button :disabled="!actionsEnabled" class="btn btn-danger" type="button" @click="fight()">{{
                texts.fight
              }}
            </button>
          </div>
        </div>
        <div class="row">
          <ul class="list-unstyled combat-actions">
            <li v-for="action of game.currentLocation.combatActions">
              <button :class="store.getButtonClass(action)" :disabled="!actionsEnabled" class="btn" type="button"
                      @click="execute(action)">{{ action[1].text }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else id="combat-win">
      <h2 class="combat-win-header">{{ texts.combatWin }}</h2>
      <ul class="combat-winnings">
        <li>
          <span class="enemies-defeated-header">{{ texts.enemiesDefeated }}</span>
          <ul>
            <li v-for="enemy of game.combat.winnings.enemiesDefeated">{{ enemy.name }}</li>
          </ul>
        </li>
        <li v-if="game.combat.winnings.currency" class="currency-won">
          {{ texts.format(texts.currencyWon, [game.combat.winnings.currency.toString()]) }}
        </li>
        <li v-if="game.combat.winnings.itemsWon.length">
          <span class="items-taken-header">{{ texts.itemsTaken }}</span>
          <ul>
            <li v-for="item of game.combat.winnings.itemsWon">{{ item.name }}</li>
          </ul>
        </li>
      </ul>
    </div>

    <fieldset class="combatlog">
      <legend>{{ texts.messages }}</legend>
      <ul class="list-unstyled action-log">
        <li v-for="message of game.combatLog">{{ message }}</li>
      </ul>
    </fieldset>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {ref} from "vue";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const store = useStateStore();
const {game, enemiesPresent} = storeToRefs(store);
const {texts, itemService, combatService} = store.services;

const split = (array: any[], size: number): any[] => {
  const result = [];

  if (!array) {
    return result;
  }

  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
}

const actionsEnabled = ref(true);
const enemyRows = ref<Array<Array<IEnemy>>>(split(game.value.combat.enemies, 3));
const characterRows = ref<Array<Array<ICombatTurn>>>(split(game.value.combat, 3));

const getItemName = (item: IItem): string => itemService.getItemName(item);

const execute = (action: [string, IAction]) => store.executeAction(action);

const itemChange = (item: IItem, turn: ICombatTurn) => {
  const currentTarget = turn.target;
  const targets = turn.targetsAvailable.concat([turn.character]).filter(t => combatService.canTarget(item, t, turn.character));
  turn.target = targets.filter(t => t === currentTarget)[0] ?? targets[0];
}

const filteredTargets = (turn: ICombatTurn): IEnemy[] | ICombatTurn[] => turn.targetsAvailable.concat([turn.character]).filter(t => combatService.canTarget(turn.item, t, turn.character));

const fight = (): void => {
  actionsEnabled.value = false;

  Promise.resolve(combatService.fight(game.value.combat)).then(() => {
    actionsEnabled.value = true;
    characterRows.value = split(game.value.combat, 3) as Array<Array<ICombatTurn>>;
  });
}

const itemSelectable = (item: IItem) => combatService.isSelectable(item);

</script>