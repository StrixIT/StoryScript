<template>
  <div v-if="game.state === GameState.Victory" id="victory" class="container-fluid">
    <div class="col-12">
      <h1>{{ texts.youWon }}</h1>
      <div><span>{{ texts.congratulations }}</span></div>
      <div><span>{{ texts.finalScore }}{{ game.party.score }}</span></div>
      <button class="btn btn-primary" type="button" @click="gameService.restart()">{{ texts.playAgain }}</button>
      <high-scores v-if="game.party.score > 0" :scores="game.highScores"></high-scores>
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

</script>