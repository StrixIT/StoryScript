<template>
  <div v-if="showTitleScreen" id="title-screen" ref="title-screen">
    <h1>{{ texts.gameName }}</h1>
  </div>
  <div v-if="showTitleScreen" id="title-screen-start">
    <button id="start-game" class="btn btn-primary" type="button" @click="startGame()">{{ hasProgress ? texts.continueGame : texts.startGame }}</button>
  </div>
</template>
<script lang="ts" setup>

import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed, onMounted, useTemplateRef, watch} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {rules, texts, gameService, dataService, autoplayService} = store.services;
const hasProgress = dataService.hasGameState()

const titleScreen = useTemplateRef('title-screen');
const transitionDelay = rules.setup?.titleScreen?.transitionDelay ?? 1;
const showTitleScreen = computed(() => rules.setup?.titleScreen?.showTitleScreen && !game.value.started);

const startGame = () => {
  autoplayService.stop();
  game.value.playState = null;
  gameService.init();
}

onMounted(() => { 
  if (titleScreen.value) { 
    titleScreen.value.style = `transition: opacity ${transitionDelay}s ease-out;`;
  }
});

watch(() => game.value.autoplaying, (newVal) => { 
  if (titleScreen.value) {
    titleScreen.value.style.opacity = newVal ? '0' : '1';
  }
});

</script>