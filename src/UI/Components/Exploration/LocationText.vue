<template>
  <div v-if="show" class="box-container" id="location">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [location.name])"></div>
    <div v-html="location.description" @click="event => click(event)" @mouseover="event => mouseOver(event)" ref="description"></div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in location.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
  import {computed, useTemplateRef} from "vue";
  import {useStateStore} from "ui/StateStore.ts";
  import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
  import {addHtmlSpaces, compareString} from "storyScript/utilityFunctions.ts";
  import {IFeature} from "storyScript/Interfaces/feature.ts";
  import {IGameCombinations} from "storyScript/Interfaces/combinations/gameCombinations.ts";

  const store = useStateStore();
  const {texts, combinationService} = store.services;

  const description = useTemplateRef('description');
  
  const { location, combinations } = defineProps<{
    location?: ICompiledLocation,
    combinations?: IGameCombinations
  }>();

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
          const feature = location.features.get(e.getAttribute('name'));

          if (feature) {
            location.description = location.description.replace(new RegExp('<feature name="' + feature.id + '">\s*<\/feature>'), '<feature name="' + feature.id + '">' + addHtmlSpaces(feature.description) + '<\/feature>');
          }
        });

    // Remove the text of deleted features.
    featureArray.filter(e => e.innerHTML.trim() !== '')
        .forEach((e) => {
          if (combinations.combinationResult.featuresToRemove.indexOf(e.getAttribute('name')) > -1) {
            e.innerHTML = '';
          }
        });

    featureArray.forEach((e) => {
      e.classList.remove('combine-active-selected');
      e.classList.add('combine-selectable');
    });
  };
  
  refreshFeatures(true);
  
  const show = computed(() => location.description || !location.features?.collectionPicture);

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
        const previousNumberOfFeatures = location.features.length;
        const result = combinations.tryCombine(feature);
        addCombineClass(ev, feature);
        
        if (result && location.features.length > previousNumberOfFeatures) {
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
    return location.features.get(featureName);
  }
  
</script>