<template>
  <div v-if="location?.features?.collectionPicture" id="location-visual" class="box-container">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [location.name])"></div>
    <div id="visual-features" ref="location-features">
      <img :alt="location.name" :src="`resources/${location.features.collectionPicture}`" :usemap="'#' + location.id"
           @load="initFeatures()">
      <map :name="location.id">
        <area v-for="feature of location.features" :id="`feature-area-${feature.id}`" :alt="feature.name"
              :class="getFeatureClass(feature)" :coords="feature.coords"
              :shape="feature.shape" href="#" @click="game.combinations.tryCombine(feature)"/>
      </map>
      <div v-for="feature of location.features">
        <img v-if="feature.picture" :id="`feature-${feature.id}`" :alt="feature.name"
             :src="`resources/${feature.picture}`" class="feature-picture feature-cursor"
             @click="game.combinations.tryCombine(feature)"/>
        <sprite v-if="feature.animation" :id="`feature-${feature.id}`" :alt="feature.name"
                :class="getFeatureClass(feature)" :factor="factor" :spriteSettings="feature.animation"
                class="feature-picture"
                @click="game.combinations.tryCombine(feature)"></sprite>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {computed, useTemplateRef} from "vue";
import {storeToRefs} from "pinia";
import {useVisualFeatures} from "ui/Composables/VisualFeatures.ts";
import {IFeature} from "storyScript/Interfaces/feature";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;
const location = computed(() => game.value.currentLocation);

const {initFeatures, factor} = useVisualFeatures(useTemplateRef('location-features'));

const getFeatureClass = (feature: IFeature) => feature.interactive === false ? '' : 'feature-cursor';

</script>