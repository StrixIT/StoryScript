<template>
  <div v-if="show" id="location" class="box-container">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [game.currentLocation.name])"></div>
    <img v-if="game.currentLocation.picture"
         :alt="game.currentLocation.name"
         :src="game.currentLocation.picture"
         class="location-picture"/>
    <div ref="description"
         @click="event => click(event)"
         @mouseover="event => mouseOver(event)"
         @mouseout="event => mouseOut(event)"
         v-html="descriptionToShow"></div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in game.currentLocation.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {ref, watch, computed, onMounted, useTemplateRef} from "vue";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {useTextFeatures} from "ui/Composables/TextFeatures.ts";
import {checkAutoplay} from "ui/helpers.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;
const {click, mouseOver, mouseOut, refreshFeatures} = useTextFeatures(useTemplateRef('description'));

const show = computed(() => game.value.currentLocation.description || !game.value.currentLocation.features?.collectionPicture);
const descriptionToShow = ref<string>(null);

watch(() => game.value.currentLocation.description, async (newValue) => {
  descriptionToShow.value = checkAutoplay(game.value, newValue);
}, { immediate: true });

onMounted(() => {
  refreshFeatures();
});

</script>