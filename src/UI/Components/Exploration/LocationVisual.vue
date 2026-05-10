<template>
  <div v-if="location?.features?.collectionPicture" id="location-visual" class="box-container">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [location.name])"></div>
    <div id="visual-features" ref="location-features">
      <img :alt="location.name" :src="`resources/${location.features.collectionPicture}`" :usemap="'#' + location.id" @load="prepareFeatures(true)">
      <map :name="location.id">
        <area v-for="feature of location.features" :alt="feature.name" :coords="feature.coords" :shape="feature.shape"
              href="#" @click="game.combinations.tryCombine(feature)" @mouseover="e => setCursor(e, false)" @mouseout="e => setCursor(e, true)" />
      </map>
      <div v-for="feature of location.features">
        <img v-if="feature.picture" :id="`feature-${feature.id}`" :alt="feature.name"
             :src="`resources/${feature.picture}`" :style="getFeatureCoordinates(feature)"
             class="feature-picture" @click="game.combinations.tryCombine(feature)" @mouseover="e => setCursor(e, false)" @mouseout="e => setCursor(e, true)" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {computed, useTemplateRef} from "vue";
import {storeToRefs} from "pinia";
import {useVisualFeatures} from "ui/Composables/VisualFeatures.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;
const location = computed(() => game.value.currentLocation);

const {prepareFeatures, getFeatureCoordinates} = useVisualFeatures(useTemplateRef('location-features'));

window.onresize = () => {
  prepareFeatures();
};

const setCursor = (e: MouseEvent, regular: boolean) => {
  const combinationAction = game.value.combinations.activeCombination?.selectedCombinationAction;
  
  if (!combinationAction) {
    return;
  }
  
  const className = combinationAction.text.toLowerCase();
  const element = e.target as HTMLAreaElement;
  
  if (regular) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

</script>