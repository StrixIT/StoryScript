<template>
  <div v-if="show" id="location" class="box-container">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [game.currentLocation.name])"></div>
    <img v-if="game.currentLocation.picture" :alt="game.currentLocation.name" :src="game.currentLocation.picture" class="location-picture"/>
    <div ref="description" @click="event => click(event)" @mouseover="event => mouseOver(event)"
         v-html="game.currentLocation.description"></div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in game.currentLocation.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {computed, useTemplateRef} from "vue";
import {useStateStore} from "ui/StateStore.ts";
import {addHtmlSpaces, compareString} from "storyScript/utilityFunctions.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, combinationService} = store.services;
const description = useTemplateRef('description');

// This array can be used in the template to display translations for world properties.
const worldProperties: { name: string, value: string }[] = [];

for (const n in game.value.worldProperties) {
  if (game.value.worldProperties.hasOwnProperty(n) && texts.worldProperties?.hasOwnProperty(n)) {
    const value = texts.worldProperties[n];
    worldProperties.push({name: n, value: value});
  }
}

const refreshFeatures = (newValue: boolean) => {
  if (!newValue) {
    return;
  }

  // Show the text of added features.
  const features = description.value?.getElementsByTagName('feature');

  if (!features) {
    return;
  }

  const featureArray = Array.prototype.slice.call(features) as HTMLElement[];

  featureArray.filter(e => e.innerHTML.trim() === '')
      .forEach((e) => {
        const feature = game.value.currentLocation.features.get(e.getAttribute('name'));

        if (feature) {
          game.value.currentLocation.description = game.value.currentLocation.description.replace(new RegExp('<feature name="' + feature.id + '">\s*<\/feature>'), '<feature name="' + feature.id + '">' + addHtmlSpaces(feature.description) + '<\/feature>');
        }
      });

  // Remove the text of deleted features.
  featureArray.filter(e => e.innerHTML.trim() !== '')
      .forEach((e) => {
        if (game.value.combinations.combinationResult.featuresToRemove.indexOf(e.getAttribute('name')) > -1) {
          e.innerHTML = '';
        }
      });

  featureArray.forEach((e) => {
    e.classList.remove('combine-active-selected');
    e.classList.add('combine-selectable');
  });
};

refreshFeatures(true);

const show = computed(() => game.value.currentLocation.description || !game.value.currentLocation.features?.collectionPicture);

const isFeatureNode = (ev: MouseEvent): boolean => {
  const nodeType = ev.target && (<any>ev.target).nodeName;
  return compareString(nodeType, 'feature');
}

const addCombineClass = (ev: MouseEvent, feature: IFeature) => {
  const combineClass = combinationService.getCombineClass(feature);

  if (combineClass) {
    (<any>ev.target).classList.add(combineClass);
  }
}

const click = (ev: PointerEvent) => {
  if (isFeatureNode(ev)) {
    const feature = getFeature(ev);

    if (feature) {
      const result = game.value.combinations.tryCombine(feature);
      addCombineClass(ev, feature);

      if (result.success) {
        refreshFeatures(true);
      }
    }
  }
}

const mouseOver = (ev: MouseEvent) => {
  if (isFeatureNode(ev)) {
    const feature = getFeature(ev);
    addCombineClass(ev, feature);
  }
};

const getFeature = (ev: MouseEvent): IFeature => {
  const featureName = (<any>ev.target).getAttribute('name');
  return game.value.currentLocation.features.get(featureName);
}

</script>