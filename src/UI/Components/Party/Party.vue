<template>
  <div v-if="game.party.characters.length > 1" class="box-container">
    <div class="box-title">{{ game.party.name }}</div>
    <ul class="list-unstyled">
      <li>{{ texts.partyCurrency }} {{ game.party.currency }}</li>
    </ul>
  </div>
  <div v-for="character of game.party.characters"
       :class="{ 'is-active': character === activeCharacter, 'unavailable': character.currentHitpoints <= 0 }"
       class="character-container"
       @click="store.setActiveCharacter(character)">
    <character-sheet :character="character" :party="game.party"></character-sheet>
    <equipment :character="character"></equipment>
    <backpack :character="character"></backpack>
  </div>
  <quests :quests="game.party.quests"></quests>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

const activeCharacter = computed(() => game.value.activeCharacter);

</script>