<template>
  <div v-if="location?.features?.collectionPicture" id="location-visual" class="box-container">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [location.name])"></div>
    <div id="visual-features">
      <img :alt="location.name" :src="`resources/${location.features.collectionPicture}`" :usemap="'#' + location.id">
      <map :name="location.id">
        <area v-for="feature of location.features" :alt="feature.name" :coords="feature.coords" :shape="feature.shape"
              href="#0" @click="game.combinations.tryCombine(feature)"/>
      </map>
      <div v-for="feature of location.features">
        <img v-if="feature.picture" :alt="feature.name" :name="`feature-${feature.id}`"
             :src="`resources/${feature.picture}`" :style="getFeatureCoordinates(feature)"
             class="feature-picture" @click="game.combinations.tryCombine(feature)"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {compareString} from "storyScript/utilityFunctions.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {IGameCombinations} from "storyScript/Interfaces/combinations/gameCombinations.ts";
import {computed} from "vue";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

const location = computed(() => game.value.currentLocation);

const getFeatureCoordinates = (feature: IFeature): { top: string, left: string } => {
  const coords = feature.coords.split(',');
  let top: string, left: string;

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