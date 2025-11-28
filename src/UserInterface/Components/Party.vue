<template>
  <div v-if="party.characters.length > 1" class="box-container">
    <div class="box-title">{{party.name}}</div>
    <ul class="list-unstyled">
      <li>{{ texts.currency }} {{ party.currency }}</li>
    </ul>
  </div>
  <div v-for="character of party.characters" class="character-container" @click="setActive(character)" :class="{ 'is-active': (<any>character).isActive, 'unavailable': character.currentHitpoints <= 0 }">
    <character-sheet :character="character"></character-sheet>
    <equipment :character="character"></equipment>
    <backpack :character="character"></backpack>
  </div>
  <quests></quests>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {IParty} from "storyScript/Interfaces/party.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

const store = useStateStore();
const {game, texts} = storeToRefs(store);

const { party } = defineProps<{
  party?: IParty
}>();

const setActive = (character: ICharacter) => game.value.activeCharacter = character;

</script>