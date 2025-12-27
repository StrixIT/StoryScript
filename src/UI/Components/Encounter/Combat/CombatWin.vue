<template>
  <div id="combat-win">
    <h2 class="combat-win-header">{{ texts.combatWin }}</h2>
    <ul class="combat-winnings">
      <li>
        <span class="enemies-defeated-header">{{ texts.enemiesDefeated }}</span>
        <ul>
          <li v-for="enemy of winnings.enemiesDefeated">{{ enemy.name }}</li>
        </ul>
      </li>
      <li v-if="winnings.currency" class="currency-won">
        {{ texts.format(texts.currencyWon, [winnings.currency.toString()]) }}
      </li>
      <li v-if="winnings.itemsWon.length">
        <span class="items-taken-header">{{ texts.itemsTaken }}</span>
        <ul>
          <li v-for="item of winnings.itemsWon">{{ item.name }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {ICombatWinnings} from "storyScript/Interfaces/combatWinnings.ts";

const store = useStateStore();
const {texts} = store.services;

const {winnings} = defineProps<{
  winnings: ICombatWinnings
}>();

</script>