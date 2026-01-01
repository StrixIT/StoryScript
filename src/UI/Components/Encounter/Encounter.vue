<template>
  <div v-if="activePersons.length > 0 && !enemiesPresent" id="encounters" class="box-container">
    <div class="box-title">{{ texts.encounters }}</div>
    <ul class="list-unstyled">
      <li v-for="person of activePersons" :class="game.combinations.getCombineClass(person)"
          @click="game.combinations.tryCombine(person)">
        <span class="person-name">{{ person.name }}</span>
        <div class="inline">
          <button v-if="person.conversation" class="btn btn-info talk" type="button" @click="conversationService.talk(person)">
            {{ texts.format(texts.talk, [person.name]) }}
          </button>
          <button v-if="person.trade" class="btn btn-info trade" type="button" @click="store.trade(game.currentLocation, person)">
            {{ texts.format(texts.trade, [person.name]) }}
          </button>
          <button v-if="hasDescription(person)" class="btn btn-info examine" type="button"
                  @click="store.showDescription('person', person, person.name)">
            {{ texts.format(texts.examine, [person.name]) }}
          </button>
          <button v-if="person.canAttack === undefined || person.canAttack === true" class="btn btn-danger"
                  type="button" @click="store.startCombat(game.currentLocation, person)">{{ texts.format(texts.attack, [person.name]) }}
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
import {hasDescription} from "storyScript/Services/sharedFunctions.ts";

const store = useStateStore();
const {game, enemiesPresent, activePersons} = storeToRefs(store);
const {texts, conversationService} = store.services;

</script>