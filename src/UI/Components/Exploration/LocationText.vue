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
const {description, click, mouseOver, refreshFeatures} = useTextFeatures(useTemplateRef('description'));

const show = computed(() => game.value.currentLocation.description || !game.value.currentLocation.features?.collectionPicture);

onMounted(() => {
  refreshFeatures(true);
});

</script>