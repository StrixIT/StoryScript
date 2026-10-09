<template>
  <modal-dialog :canClose="true"
                :closeButton="true"
                :openState="PlayState.Description"
                :title="game.currentDescription.title">
    <div class="description" v-html="descriptionToShow"></div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";
import {checkAutoplay} from "ui/helpers.ts";

const store = useStateStore();
const {game} = storeToRefs(store);

const descriptionToShow = ref<string>(null);

watch(() => game.value.currentDescription, async (newValue) => {
  descriptionToShow.value = checkAutoplay(game.value, newValue.item.description);
}, { immediate: true });

</script>