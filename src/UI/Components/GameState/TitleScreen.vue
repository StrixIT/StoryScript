<template>
  <div id="title-screen">
    <h1>{{ texts.gameName }}</h1>
    <button class="btn btn-primary" type="button" @click="startGame()">{{ texts.startGame }}</button>
    <p id="autoplay-text" v-if="demoMode.showDemoPlayText">{{ texts.demoPlayText }}</p>
  </div>
</template>
<script lang="ts" setup>

import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {onMounted} from "vue";

const store = useStateStore();
const {game, runningDemo} = storeToRefs(store);
const {texts, gameService} = store.services;

const demoMode = game.value.demoMode;
let demoTimer: NodeJS.Timeout;
let demoTextTimer: NodeJS.Timeout;

const startGame = () => {
  clearTimeout(demoTimer);
  clearTimeout(demoTextTimer);
  runningDemo.value = false;
  gameService.restart();
  game.value.playState = null;
}

onMounted(() => {
  if (demoMode?.runningDemo && demoMode?.startInterval && demoMode.steps?.[0]) {
    const titleScreen = game.value.UIRootElement.querySelector('#title-screen') as HTMLElement;
    const autoPlayText = game.value.UIRootElement.querySelector('#autoplay-text') as HTMLElement;
    let autoTextVisible = true;

    demoTextTimer = setInterval(() => {
      autoPlayText.style = autoTextVisible ? 'visibility: visible;' : 'visibility: hidden;';
      autoTextVisible = !autoTextVisible;
    }, 1000);

    setTimeout(() => {
      titleScreen.style = `background: none; transition: background-color ${demoMode.startTransitionDelay ?? 1}s ease-out;`

      demoTimer = setTimeout(() => {
        runDemoStep(demoMode, 0);
      }, demoMode.startInterval)
    }, 1000);

    demoTextTimer = setInterval(() => {})
  }
});

function runDemoStep(demoMode: IDemoMode, stepNumber: number) {
  if (stepNumber >= demoMode.steps.length) {
    demoTimer = setTimeout(() => {
      demoTimer = null;
      demoMode.restart();

      demoTimer = setTimeout(() => {
        runDemoStep(demoMode, 0);
      }, demoMode.steps[0].delay)
      
    }, demoMode.steps[stepNumber - 1].delay);
    
    return;
  }
  
  const currentStep = demoMode.steps[stepNumber];
  
  demoTimer = setTimeout(() => {
    currentStep.action(game.value);
    stepNumber++;
    runDemoStep(demoMode, stepNumber);
  }, currentStep.delay);
}

</script>