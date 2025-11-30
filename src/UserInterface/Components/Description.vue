<template>
  <dialog :open="playState === PlayState.Description">
    <div class="description" v-html="description"></div>
  </dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

const store = useStateStore();
const {texts} = storeToRefs(store);

const { playState, description } = defineProps<{
  playState: PlayState;
  description?: string
}>();

</script>