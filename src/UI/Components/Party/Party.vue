<template>
  <div v-if="party.characters.length > 1" class="box-container">
    <div class="box-title">{{ party.name }}</div>
    <ul class="list-unstyled">
      <li>{{ texts.currency }} {{ party.currency }}</li>
    </ul>
  </div>
  <div v-for="character of party.characters" :class="{ 'is-active': (<any>character).isActive, 'unavailable': character.currentHitpoints <= 0 }" class="character-container"
       @click="store.setActiveCharacter(character)">
    <character-sheet :character="character" :party="party"></character-sheet>
    <equipment :character="character"></equipment>
    <backpack :character="character"></backpack>
  </div>
  <quests :quests="party.quests"></quests>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IParty} from "storyScript/Interfaces/party.ts";

const store = useStateStore();
const {texts} = store.services;

const {party} = defineProps<{
  party?: IParty
}>();

</script>