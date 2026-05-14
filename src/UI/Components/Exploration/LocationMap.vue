<template>
  <div v-if="map" class="box-container map-container" tabindex="0">
    <p class="map-name">
      {{ map.name }}
      <span v-if="map.toggleFullScreen"
            class="map-full-screen-toggle"
            @click="toggleFullScreen()">
        {{ texts.openFullScreenMap }}
      </span>
      <span v-if="markerKey" class="show-marker-instructions" @click="toggleTouchMarkersVisible()">
        {{ isTouchDevice ? texts.touchToShowMarkers : texts.format(texts.pressToShowMarkers, [markerKey]) }}
      </span>
    </p>
    <img ref="map-element" :alt="map.name" :src="`resources/${map.mapImage}`" class="map-image" @load="showMap()">
    <img v-if="map.avatarImage" :alt="map.name" :src="`resources/${map.avatarImage}`" class="avatar-image"
         style="visibility: hidden;">
  </div>
  <dialog ref="map-dialog" class="map-dialog">
  </dialog>
</template>
<script lang="ts" setup>
import {useTemplateRef} from "vue";
import {useLocationMap} from "ui/Composables/LocationMap.ts";
import {useStateStore} from "ui/StateStore.ts";
import {isTouchDevice} from "../../../../constants.ts";

const store = useStateStore();
const {texts} = store.services;
const {
  map,
  showMap,
  toggleFullScreen,
  toggleTouchMarkersVisible
} = useLocationMap(useTemplateRef('map-element'), useTemplateRef('map-dialog'));

const markerKey = map.value.showMarkersOnKeyPress ?
    // When an empty value is specified use the space key. Use the key specified otherwise.
    map.value.showMarkersOnKeyPress.trim()
        ? map.value.showMarkersOnKeyPress : 'space'
    : null;

</script>