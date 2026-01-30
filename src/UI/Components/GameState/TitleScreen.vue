<template>
  <div v-if="showTitleScreen" id="title-screen" ref="title-screen">
    <h1>{{ texts.gameName }}</h1>
  </div>
  <div v-if="showTitleScreen" id="title-screen-start">
    <button id="start-game" class="btn btn-primary" type="button" @click="startGame()">{{ texts.startGame }}</button>
  </div>
</template>
<script lang="ts" setup>

import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed, onMounted, useTemplateRef, watch} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {rules, texts, gameService, autoplayService} = store.services;

const titleScreen = useTemplateRef('title-screen');
const transitionDelay = rules.setup?.titleScreen?.transitionDelay ?? 1;
const showTitleScreen = computed(() => rules.setup?.titleScreen?.showTitleScreen && !game.value.started);

const startGame = () => {
  autoplayService.stop();
  game.value.playState = null;
  gameService.init();
}

onMounted(() => titleScreen.value.style = `transition: opacity ${transitionDelay}s ease-out;`);

watch(() => game.value.autoplaying, (newVal) => titleScreen.value.style.opacity = newVal ? '0' : '1');

</script>