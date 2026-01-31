<template>
  <div v-if="game.autoplaying" id="autoplay-overlay">
    <p id="autoplay-text" ref="autoplay-text">{{ texts.autoplayText }}</p>
  </div>
</template>
<script lang="ts" setup>

import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {useTemplateRef, watch} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

const autoPlayText = useTemplateRef('autoplay-text');
let demoTextTimer: NodeJS.Timeout;

watch(() => game.value.autoplaying, (newVal) => {
  clearInterval(demoTextTimer);
  
  if (newVal) {
    let autoTextVisible = true;

    demoTextTimer = setInterval(() => {
      autoPlayText.value.style = autoTextVisible ? 'visibility: visible;' : 'visibility: hidden;';
      autoTextVisible = !autoTextVisible;
    }, 1000);
  }
});

</script>