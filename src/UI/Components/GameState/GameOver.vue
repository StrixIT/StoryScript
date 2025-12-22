<template>
  <div v-if="game.state === GameState.GameOver" id="game-over" class="container-fluid">
    <div class="col-12">
      <h2>{{ texts.youLost }}</h2>
      <p>{{ texts.questFailed }}</p>
      <div>{{ texts.finalScore }}{{ score }}</div>
      <button class="btn btn-primary restart" type="button" @click="restart()">{{ texts.tryAgain }}</button>
      <high-scores v-if="score > 0" :scores="game.highScores"></high-scores>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {GameState} from "storyScript/Interfaces/storyScript.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, gameService} = store.services;

const {score} = defineProps<{
  score: number;
}>();

const restart = (): void => gameService.restart();

</script>