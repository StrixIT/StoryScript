<template>
  <dialog :open="playState === openState" class="dialog">
    <h1 class="dialog-title menu-title">
      {{ texts.mainMenu }}
    </h1>
    <div class="dialog-body menu-body">
      <slot></slot>
    </div>
    <div class="dialog-footer">
      <button type="button" class="btn btn-primary" @click="closeModal()">{{ closeText }}</button>
    </div>
  </dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

const { playState, openState } = defineProps<{
  playState?: PlayState,
  openState?: PlayState,
  closeText?: string
}>();

const closeModal = () => {
  game.value.playState = null;
}

</script>