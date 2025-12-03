<template>
  <sound :sounds="game.sounds" :rootElement="game.UIRootElement"></sound>
  <game-menu :state="game.state" :playState="game.playState"></game-menu>
  <div ref="ui-root">
    <game-container></game-container>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, useTemplateRef} from "vue";
import {useServices} from "vue/Services.ts";

const store = useStateStore();
const services = useServices();
const {game} = storeToRefs(store);
const uiRoot = useTemplateRef('ui-root');
const gameService = services.getGameService();

onMounted(() => game.value.UIRootElement = uiRoot.value);

gameService.watchPlayState(() => stopAutoplay);

const stopAutoplay = () => {
  const mediaElements = uiRoot.value.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
  mediaElements.forEach((m: Element) => (m as HTMLMediaElement).pause());
}

</script>