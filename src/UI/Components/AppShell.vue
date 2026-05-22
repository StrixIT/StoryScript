<template>
  <div ref="ui-root">
    <sound></sound>
    <autoplay></autoplay>
    <title-screen></title-screen>
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
import {onMounted, useTemplateRef, watch} from "vue";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ICustomCursor} from "storyScript/Interfaces/customCursor.ts";
import {isTouchDevice} from "../../../constants.ts";

const store = useStateStore();
const {game, error, customCursor} = storeToRefs(store);
const {gameService, dataService} = store.services;
const uiRoot = useTemplateRef('ui-root');

const saveStates = [PlayState.Combat, PlayState.Conversation, PlayState.Trade];

onMounted(() => game.value.UIRootElement = uiRoot.value.closest('body'));

watch(() => customCursor.value, (newValue: ICustomCursor) => {
  if (!isTouchDevice && newValue) {
    game.value.UIRootElement.style.cursor = newValue.style;

    game.value.UIRootElement.addEventListener('mouseover', e => {
      const target = e.target as HTMLElement;
      const targetStyle = getComputedStyle(target);
      
      if (targetStyle.cursor !== 'pointer') {
        return;
      }

      target.style.cursor = newValue.style;
    });
  }
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