<template>
  <div v-if="map" class="box-container map-container" tabindex="0">
    <div class="map-name">
      <div class="float-left">
        {{ map.name }}
        <span v-if="markerKey" class="show-marker-instructions" @click="toggleTouchMarkersVisible()">
        {{ isTouchDevice ? texts.touchToShowMarkers : texts.format(texts.pressToShowMarkers, [markerKey]) }}
      </span>
      </div>
      <div v-if="map.toggleFullScreen"
           class="map-full-screen-toggle"
           @click="toggleFullScreen()">
        {{ texts.openFullScreenMap }}
      </div>
    </div>
    <img ref="map-element" :alt="map.name" :src="`resources/${map.mapImage}`" class="map-image" @load="showMap()">
    <img v-if="map.avatarImage" :alt="map.name" :src="`resources/${map.avatarImage}`" class="avatar-image"
         style="visibility: hidden;">
  </div>
  <dialog ref="map-dialog" class="map-dialog">
  </dialog>
</template>
<script lang="ts" setup>
import {isTouchDevice, useLocationMap, useStateStore} from 'storyScript';

const store = useStateStore();
const {texts} = store.services;
const {
  map,
  markerKey,
  showMap,
  toggleFullScreen,
  toggleTouchMarkersVisible
} = useLocationMap();

</script>