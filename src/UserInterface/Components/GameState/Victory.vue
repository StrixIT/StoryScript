<template>
  <div class="container-fluid">
    <div class="col-12">
      <h1>{{ texts.youWon }}</h1>
      <div><span>{{ texts.congratulations }}</span></div>
      <div><span>{{ texts.finalScore }}{{ score }}</span></div>
      <button class="btn btn-primary" type="button" @click="restart()">{{ texts.playAgain }}</button>
      <high-scores v-if="score > 0" :scores="game.highScores"></high-scores>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, gameService} = store.services;

const {score} = defineProps<{
  score?: number;
}>();

const restart = (): void => gameService.restart();

</script>