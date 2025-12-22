<template>
  <div v-if="game.party.characters.length > 1" class="box-container">
    <div class="box-title">{{ game.party.name }}</div>
    <ul class="list-unstyled">
      <li>{{ texts.currency }} {{ game.party.currency }}</li>
    </ul>
  </div>
  <div v-for="character of game.party.characters"
       :class="{ 'is-active': (<any>character).isActive, 'unavailable': character.currentHitpoints <= 0 }"
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

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

</script>