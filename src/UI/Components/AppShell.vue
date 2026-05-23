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
import {useTemplateRef} from "vue";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {useCustomCursor} from "ui/Composables/CustomCursor.ts";
import {usePlayStateWatch} from "ui/Composables/playStateWatch.ts";

const store = useStateStore();
const {game, error} = storeToRefs(store);
const uiRoot = useTemplateRef('ui-root');

useCustomCursor(uiRoot);
usePlayStateWatch(uiRoot);

const reload = () => {
  window.location.reload();
}

</script>