<template>
  <div v-if="location?.activePersons?.length > 0 && !enemiesPresent(game)" class="box-container" id="encounters">
    <div class="box-title">{{ texts.encounters }}</div>
    <ul class="list-unstyled">
      <li v-for="person of location.activePersons" @click="tryCombine(game, person)" :class="combinations.getCombineClass(person)">
        <span class="person-name">{{ person.name }}</span>
        <div class="inline">
          <button v-if="person.conversation" type="button" class="btn btn-info talk" @click="talk(person)">{{ texts.format(texts.talk, [person.name]) }}</button>
          <button v-if="person.trade" type="button" class="btn btn-info trade" @click="trade(person)">{{ texts.format(texts.trade, [person.name]) }}</button>
          <button v-if="hasDescription(person)" type="button" class="btn btn-info examine" @click="showDescription(person, person.name)">{{ texts.format(texts.examine, [person.name]) }}</button>
          <button v-if="person.canAttack === undefined || person.canAttack === true" type="button" class="btn btn-danger" @click="startCombat(person)">{{ texts.format(texts.attack, [person.name]) }}</button>
        </div>
        <img v-if="person.picture" class="person-picture" :src="person.picture" :alt="person.name" />
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {ITrade} from "storyScript/Interfaces/trade.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {IGameCombinations} from "storyScript/Interfaces/combinations/gameCombinations.ts";
import {enemiesPresent, tryCombine} from "vue/Helpers.ts";
import {hasDescription} from "storyScript/Services/sharedFunctions.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, conversationService} = store.services;

const { location, combinations } = defineProps<{
  location?: ICompiledLocation,
  combinations?: IGameCombinations
}>();

const showDescription = (person: IPerson, title: string): void => {
  game.value.currentDescription = {type: 'person', item: person, title: title};
}

const talk = (person: IPerson): void => conversationService.talk(person);

const trade = (trade: IPerson | ITrade): boolean => store.trade(location, trade);

const startCombat = (person: IPerson): void => store.startCombat(location, person);
</script>