<template>
  <dialog :open="playState === openState">
    <div class="modal-backdrop show" aria-hidden="true"></div>
    <div class="d-block modal" @click="e => closeModal(e)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="model-title">
              {{ texts.mainMenu }}
            </h4>
            <button type="button" aria-label="Close" class="close" @click="closeModal()">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
<!--            <button type="button" class="btn btn-primary" @click="closeModal()">{{ closeText }}</button>-->
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

const { playState, openState, canClose } = defineProps<{
  playState?: PlayState,
  openState?: PlayState,
  closeText?: string,
  canClose?: boolean
}>();

const closeModal = (event?: PointerEvent) => {
  if (event) {
    if (canClose !== false|| !(<HTMLElement>event.target).classList.contains("modal")) {
      return;
    }
  }
  
  game.value.playState = null;
}

</script>