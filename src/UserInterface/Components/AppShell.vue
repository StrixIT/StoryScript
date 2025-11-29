<template>
  <sound :sounds="game.sounds" :rootElement="game.UIRootElement"></sound>
  <game-menu :state="game.state" :playState="game.playState"></game-menu>
  <game-container></game-container>
</template>

<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);

</script>