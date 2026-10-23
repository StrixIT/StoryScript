<template>
  <modal-dialog :canClose="true"
                :closeButton="true"
                :openState="PlayState.Description"
                :title="game.currentDescription.title">
    <div class="description" v-html="descriptionToShow"></div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {checkAutoplay, PlayState, useStateStore} from 'storyScript';
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);

const descriptionToShow = ref<string>(null);

watch(() => game.value.currentDescription, async (newValue) => {
  descriptionToShow.value = checkAutoplay(game.value, newValue.item.description);
}, {immediate: true});

</script>