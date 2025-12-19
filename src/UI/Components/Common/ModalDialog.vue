<template>
  <dialog :open="game.playState === openState">
    <div aria-hidden="true" class="modal-backdrop show"></div>
    <div class="d-block modal" @click="e => closeModal(e)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="model-title">
              {{ title }}
            </h4>
            <button v-if="canClose" aria-label="Close" class="close" type="button" @click="closeModal()">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button v-if="closeButton && canClose" class="btn btn-primary" type="button" @click="closeModal()">
              {{ closeText ?? texts.closeModal }}
            </button>
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

const {openState, canClose} = defineProps<{
  openState: PlayState,
  canClose: boolean,
  title: string,
  closeButton: boolean,
  closeText?: string,
}>();

const closeModal = (event?: PointerEvent) => {
  if (event) {
    if (canClose === false || !(<HTMLElement>event.target).classList.contains("modal")) {
      return;
    }
  }

  game.value.playState = null;
}

</script>