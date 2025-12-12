<template>
  <dialog :open="playState === PlayState.Description">
    <div class="description" v-html="description"></div>
  </dialog>
</template>
<script lang="ts" setup>
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const { playState, description } = defineProps<{
  playState: PlayState;
  description?: string
}>();

</script>