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
         v-html="game.currentLocation.description"></div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in game.currentLocation.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, useTemplateRef} from "vue";
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {useTextFeatures} from "ui/Composables/TextFeatures.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;
const descriptionRef = useTemplateRef('description');
const {description, click, mouseOver, refreshFeatures} = useTextFeatures();

const show = computed(() => game.value.currentLocation.description || !game.value.currentLocation.features?.collectionPicture);

// This array can be used in the template to display translations for world properties.
const worldProperties: { name: string, value: string }[] = [];

for (const n in game.value.worldProperties) {
  if (game.value.worldProperties.hasOwnProperty(n) && texts.worldProperties?.hasOwnProperty(n)) {
    const value = texts.worldProperties[n];
    worldProperties.push({name: n, value: value});
  }
}

onMounted(() => {
  description.value = descriptionRef.value;
  refreshFeatures(true);
});

</script>