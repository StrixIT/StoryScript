<template>
  <modal-dialog :close-text="texts.closeModal"
                :closeButton="true"
                :open-state="PlayState.Description"
                :playState="game.playState"
                :title="game.currentDescription.title">
    <div class="description" v-html="game.currentDescription.item.description"></div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

</script>