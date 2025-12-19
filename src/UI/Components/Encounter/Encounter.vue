<template>
  <div v-if="activePersons.length > 0 && !enemiesPresent" id="encounters" class="box-container">
    <div class="box-title">{{ texts.encounters }}</div>
    <ul class="list-unstyled">
      <li v-for="person of activePersons" :class="game.combinations.getCombineClass(person)"
          @click="store.tryCombine(person)">
        <span class="person-name">{{ person.name }}</span>
        <div class="inline">
          <button v-if="person.conversation" class="btn btn-info talk" type="button" @click="talk(person)">
            {{ texts.format(texts.talk, [person.name]) }}
          </button>
          <button v-if="person.trade" class="btn btn-info trade" type="button" @click="trade(person)">
            {{ texts.format(texts.trade, [person.name]) }}
          </button>
          <button v-if="hasDescription(person)" class="btn btn-info examine" type="button"
                  @click="store.showDescription('person', person, person.name)">
            {{ texts.format(texts.examine, [person.name]) }}
          </button>
          <button v-if="person.canAttack === undefined || person.canAttack === true" class="btn btn-danger"
                  type="button" @click="startCombat(person)">{{ texts.format(texts.attack, [person.name]) }}
          </button>
        </div>
        <img v-if="person.picture" :alt="person.name" :src="person.picture" class="person-picture"/>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {ITrade} from "storyScript/Interfaces/trade.ts";
import {hasDescription} from "storyScript/Services/sharedFunctions.ts";
import {useActiveEntityWatcher} from "ui/Composables/ActiveEntityWatcher.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, conversationService} = store.services;
const {enemiesPresent, activePersons} = useActiveEntityWatcher(game);

const talk = (person: IPerson): void => conversationService.talk(person);

const trade = (trade: IPerson | ITrade): boolean => store.trade(game.value.currentLocation, trade);

const startCombat = (person: IPerson): void => store.startCombat(game.value.currentLocation, person);
</script>