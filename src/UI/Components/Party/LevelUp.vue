<template>
  <div v-if="game.state === GameState.LevelUp" id="level-up" class="container-fluid">
    <!-- TODO: how to make this work? -->
    <div v-for="character of game.party.characters">
      <div class="col-12">
        <h2>{{ texts.levelUp }}</h2>
        <p>{{ texts.format(texts.levelUpDescription, [character.level.toString()]) }}</p>
        <build-character :sheet="game.createCharacterSheet"></build-character>
        <button v-if="game.createCharacterSheet.currentStep >= game.createCharacterSheet.steps.length - 1"
                :disabled="!characterService.distributionDone(game.createCharacterSheet, null)"
                class="btn btn-primary"
                type="button"
                @click="characterService.levelUp(character)">{{ texts.completeLevelUp }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {GameState} from "storyScript/Interfaces/storyScript.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, characterService} = store.services;

</script>