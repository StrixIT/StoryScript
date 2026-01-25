<template>
  <div ref="ui-root">
    <sound></sound>
    <title-screen v-if="runningDemo"></title-screen>
    <div>
      <game-menu v-if="game.playState === PlayState.Menu"></game-menu>
      <conversation v-if="game.playState === PlayState.Conversation"></conversation>
      <trade v-if="game.playState === PlayState.Trade"></trade>
      <combat v-if="game.playState === PlayState.Combat"></combat>
      <description v-if="game.playState === PlayState.Description"></description>
      <div v-if="error" id="error-alert">
        <div class="error-alert-body alert alert-danger">
          <h2 class="danger">{{ `An unhandled error occurred: ${error.message}!` }}</h2>
          <p>{{ error.stackTrace }}</p>
          <button class="btn btn-primary" @click="reload">Reload</button>
        </div>
      </div>
      <div>
        <navigation></navigation>
        <game-container></game-container>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, useTemplateRef} from "vue";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const store = useStateStore();
const {game, runningDemo, error} = storeToRefs(store);
const {gameService, dataService} = store.services;
const uiRoot = useTemplateRef('ui-root');

const saveStates = [PlayState.Combat, PlayState.Conversation, PlayState.Trade];

onMounted(() => {
  runningDemo.value = game.value.demoMode?.runningDemo ?? false;
  game.value.UIRootElement = uiRoot.value.closest('body');
});

gameService.watchPlayState((_, newState, oldState) => {
  stopAutoplay();

  if (newState === null && saveStates.includes(oldState)) {
    // Save the game after finishing conversations, trade and combat.
    dataService.saveGame(game.value);
  }
});

const stopAutoplay = () => {
  const mediaElements = uiRoot.value.querySelectorAll('audio:not(.storyscript-player), video:not(.storyscript-player)');
  mediaElements.forEach((m: Element) => (m as HTMLMediaElement).pause());
}

const reload = () => {
  window.location.reload();
}

</script>