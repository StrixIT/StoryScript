<template>
  <dialog :open="playState === PlayState.Combat">
    <div id="combat" class="row">
      <div v-if="enemiesPresent(game)" class="col-12">
        <h3 class="combat-header">{{ game.combat.roundHeader }}</h3>

        <div v-for="enemyRow of enemyRows" class="row enemy-row">
          <div v-for="enemy of enemyRow" class="'col-' + 12 / enemyRow.length" :class="{ 'unavailable': enemy.currentHitpoints <= 0 }">
            <combat-participant :participant="enemy"></combat-participant>
          </div>
        </div>
        
        <div v-for="characterRow of characterRows" class="row character-row">
          <div v-for="turn of characterRow" class="'col-' + 12 / characterRow.length" :class="{ 'unavailable': turn.character.currentHitpoints <= 0 }">
            <combat-participant :participant="turn.character"></combat-participant>
            <div v-if="turn.item && turn.character.currentHitpoints > 0">
              <div :class="{ 'not-applicable': !turn.item.targetType }">
                <span>{{ turn.item.targetType === 'Enemy' ? texts.attack : texts.aid }}</span>
                <select v-if="filteredTargets(turn).length > 1" class="custom-select" v-model="turn.target">
                  <option v-for="target of filteredTargets(turn)" :value="target">{{ getTargetName(target) }}</option>
                </select>
                <input v-if="filteredTargets(turn).length === 1" class="single-item" type="text" :disabled="true" v-model="turn.target.name" />
              </div>
              <div v-if="turn.itemsAvailable.length">
                <span>{{ turn.item.targetType === 'Enemy' ? texts.attackWith : turn.item.targetType ? texts.aidWith : texts.useCombatItem }}</span>
                <select v-if="turn.itemsAvailable.length > 1" class="custom-select" @change="itemChange(turn.item, turn)" v-model="turn.item">
                  <option v-for="item of turn.itemsAvailable" :value="item" :disabled="!itemSelectable(item)" :class="{'unselectable': !itemSelectable(item)}" >{{ getItemName(item) }}</option>
                </select>
                <input v-if="turn.itemsAvailable.length === 1" class="single-item" type="text" :disabled="true" :value="getItemName(turn.item)" />
              </div>
            </div>
            <div v-if="!turn.item && turn.character.currentHitpoints > 0">
              <span>{{ game.combat.noActionText }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12 fight-row">
            <button type="button" class="btn btn-danger" @click="fight()" :disabled="!actionsEnabled">{{ texts.fight }}</button>
          </div>
        </div>
        <div class="row">
          <ul class="list-unstyled combat-actions">
            <li v-for="action of combatActions">
              <button type="button" class="btn" :class="getButtonClass(action)" @click="execute(action)" :disabled="!actionsEnabled">{{ action[1].text }}</button>
            </li>
          </ul>
        </div>
      </div>

      <div v-else id="combat-win">
        <h2 class="combat-win-header">{{ texts.combatWin }}</h2>
        <ul class="combat-winnings">
          <li>
            <span class="enemies-defeated-header">{{ texts.enemiesDefeated }}</span>
            <ul>
              <li v-for="enemy of combat.winnings.enemiesDefeated">{{ enemy.name }}</li>
            </ul>
          </li>
          <li v-if="combat.winnings.currency" class="currency-won">{{ texts.format(texts.currencyWon, [combat.winnings.currency.toString()]) }}</li>
          <li v-if="combat.winnings.itemsWon.length">
            <span class="items-taken-header">{{ texts.itemsTaken }}</span>
            <ul>
              <li v-for="item of combat.winnings.itemsWon">{{ item.name }}</li>
            </ul>
          </li>
        </ul>
      </div>

      <fieldset class="combatlog">
        <legend>{{ texts.messages }}</legend>
        <ul class="list-unstyled action-log">
          <li v-for="message of combatLog">{{ message }}</li>
        </ul>
      </fieldset>
    </div>
  </dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {ref} from "vue";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ICombatSetup} from "storyScript/Interfaces/combatSetup.ts";
import {enemiesPresent, executeAction, getButtonClass} from "vue/Helpers.ts";
import {useServices} from "vue/Services.ts";

const services = useServices();
const store = useStateStore();
const {game, texts} = storeToRefs(store);

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

const itemService = services.getItemService();
const combatService = services.getCombatService();
const dataService = services.getDataService();

const {playState, combat} = defineProps<{
  playState: PlayState,
  combat: ICombatSetup<ICombatTurn>,
  combatActions: IAction[],
  combatLog: string[]
}>();

const actionsEnabled = ref(true);
const enemyRows = ref<Array<Array<IEnemy>> >(split(combat.enemies, 3));
const characterRows = ref<Array<Array<ICombatTurn>>>(split(combat, 3));

const getTargetName = (target: any) => target.name;

const getItemName = (item: IItem): string => itemService.getItemName(item);

const execute = (action: IAction) => executeAction(game.value, action, this, () => dataService.saveGame(game.value));

const itemChange = (item: IItem, turn: ICombatTurn) => {
  const currentTarget = turn.target;
  const targets = turn.targetsAvailable.concat(turn.character).filter(t => combatService.canTarget(item, t, turn.character));
  turn.target = targets.filter(t => t === currentTarget)[0] ?? targets[0];
}

const filteredTargets = (turn: ICombatTurn): IEnemy[] | ICombatTurn[] => turn.targetsAvailable.concat(turn.character).filter(t => combatService.canTarget(turn.item, t, turn.character));

const fight = (): void => {
  actionsEnabled.value = false;

  Promise.resolve(combatService.fight(combat)).then(() => {
    actionsEnabled.value = true;
    characterRows.value = split(combat, 3) as Array<Array<ICombatTurn>>;
  });
}

const itemSelectable = (item: IItem) => combatService.isSelectable(item);

</script>