<template>
  <div id="title-screen" ref="title-screen">
    <h1>{{ texts.gameName }}</h1>
    <button class="btn btn-primary" type="button" @click="startGame()">{{ texts.startGame }}</button>
  </div>
</template>
<script lang="ts" setup>

import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {useTemplateRef, watch} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {rules, texts, gameService, autoplayService} = store.services;

const titleScreen = useTemplateRef('title-screen');

const startGame = () => {
  autoplayService.stop();
  gameService.restart();
  game.value.playState = null;
}

watch(() => game.value.autoplaying, (newVal, oldVal) => {
  if (newVal) {
    const transitionDelay = rules.setup?.titleScreen?.transitionDelay ?? 1;
    const transitionDelayNumber = typeof transitionDelay === 'number' ? transitionDelay : parseFloat(transitionDelay);

    setTimeout(() => {
      titleScreen.value.style = `background: none; transition: background-color ${transitionDelay}s ease-out;`
    }, transitionDelayNumber);
  }
});

</script>