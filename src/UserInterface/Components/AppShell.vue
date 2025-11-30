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
import {useTemplateRef} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const uiRoot = useTemplateRef('ui-root');

setTimeout(() => game.value.UIRootElement = uiRoot.value);

</script>