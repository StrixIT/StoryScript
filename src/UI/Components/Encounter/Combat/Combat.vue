<template>
  <modal-dialog :canClose="!enemiesPresent"
                :closeButton="true"
                :openState="PlayState.Combat"
                :title="texts.combatTitle">
    <div v-if="enemiesPresent" id="combat" class="row">
      <div class="col-12">
        <h3 class="combat-header">{{ game.combat.roundHeader }}</h3>

        <div v-for="enemyRow of enemyRows" class="row enemy-row">
          <div v-for="enemy of enemyRow" :class="rowClass(enemyRow, enemy)">
            <combat-participant :participant="enemy"></combat-participant>
          </div>
        </div>

        <div v-for="characterRow of characterRows" class="row character-row">
          <div v-for="turn of characterRow" :class="rowClass(characterRow, turn.character)">
            <combat-participant :participant="turn.character"></combat-participant>
            <combat-target-select :setup="game.combat" :turn="turn"></combat-target-select>
          </div>
        </div>

        <div class="row">
          <div class="col-12 fight-row">
            <button
                :disabled="!actionsEnabled"
                class="btn btn-danger"
                type="button"
                @click="fight()">
              {{ texts.fight }}
            </button>
          </div>
        </div>
        <combat-actions :actions="game.currentLocation.combatActions" :enabled="actionsEnabled"></combat-actions>
      </div>
    </div>

    <combat-win v-else :winnings="game.combat.winnings"></combat-win>

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
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {ref} from "vue";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import ModalDialog from "ui/Components/Common/ModalDialog.vue";

const store = useStateStore();
const {game, enemiesPresent} = storeToRefs(store);
const {texts, combatService} = store.services;

const actionsEnabled = ref(true);
const enemyRows = ref<Array<Array<IEnemy>>>(split(game.value.combat.enemies, 3));
const characterRows = ref<Array<Array<ICombatTurn>>>(split(game.value.combat, 3));

const rowClass = (row: (IEnemy | ICombatTurn)[], participant: IEnemy | ICharacter) =>
    `col-${(12 / row.length)}` + (participant.currentHitpoints <= 0 ? ' unavailable' : '');

const fight = (): void => {
  actionsEnabled.value = false;
  Promise.resolve(combatService.fight(game.value.combat)).then(() => actionsEnabled.value = true);
}

function split(array: any[], size: number): any[] {
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

</script>