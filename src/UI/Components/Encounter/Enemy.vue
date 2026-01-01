<template>
  <div v-if="enemiesPresent" class="box-container">
    <div class="box-title">{{ texts.encounters }}</div>
    <p>{{ texts.enemiesToFight }}</p>
    <ul class="list-unstyled enemy-list">
      <li v-for="enemy of activeEnemies" :class="game.combinations.getCombineClass(enemy)"
          @click="game.combinations.tryCombine(enemy)">
        <span class="enemy-name">{{ enemy.name }}</span>
        <div :class="game.combinations.getCombineClass(enemy)" class="inline">
          <button v-if="hasDescription(enemy)" class="btn btn-info btn-sm" type="button"
                  @click="store.showDescription('enemy', enemy, enemy.name)">{{ texts.view }}
          </button>
        </div>
        <img v-if="enemy.picture" :alt="enemy.name" :src="enemy.picture" class="enemy-picture"/>
      </li>
    </ul>
    <button id="start-combat" class="btn btn-danger" type="button" @click="store.startCombat(game.currentLocation)">
      {{ texts.startCombat }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {hasDescription} from "storyScript/Services/sharedFunctions.ts";

const store = useStateStore();
const {game, enemiesPresent, activeEnemies} = storeToRefs(store);
const {texts} = store.services;

</script>