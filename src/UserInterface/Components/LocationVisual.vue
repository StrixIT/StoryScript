<template>
  <div v-if="location?.features?.collectionPicture" class="box-container" id="location-visual">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [location.name])"></div>
    <div id="visual-features">
      <img :src="`resources/${location.features.collectionPicture}`" :usemap="'#' + location.id" :alt="location.name">
      <map :name="location.id">
        <area v-for="feature of location.features" href="#0" :shape="feature.shape" :coords="feature.coords" @click="combinations.tryCombine(feature)" :alt="feature.name" />
      </map>
      <div v-for="feature of location.features" >
        <img v-if="feature.picture" class="feature-picture" :name="`feature-${feature.id}`" :src="`resources/${feature.picture}`" :style="getFeatureCoordinates(feature)" @click="combinations.tryCombine(feature)" :alt="feature.name" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {IGameCombinations} from "storyScript/Interfaces/combinations/gameCombinations.ts";

const store = useStateStore();
const {texts} = storeToRefs(store);

const { location, combinations } = defineProps<{
  location?: ICompiledLocation,
  combinations?: IGameCombinations
}>();

const getFeatureCoordinates = (feature: IFeature): { top: string, left: string } => {
  const coords = feature.coords.split(',');
  let top = null, left = null;

  if (compareString(feature.shape, 'poly')) {
    const x = [], y = [];

    for (let i = 0; i < coords.length; i++) {
      const value = coords[i];
      if (i % 2 === 0) {
        x.push(value);
      } else {
        y.push(value);
      }
    }

    left = x.reduce(function (p, v) {
      return (p < v ? p : v);
    });

    top = y.reduce(function (p, v) {
      return (p < v ? p : v);
    });
  } else {
    left = coords[0];
    top = coords[1];
  }

  return {
    top: `${top}px`,
    left: `${left}px`
  };
}

</script>