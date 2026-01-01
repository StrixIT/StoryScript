<template>
  <div v-if="map" class="box-container map-container" tabindex="0">
    <p class="map-name">
      {{ map.name }}
      <span v-if="map.toggleFullScreen" class="map-full-screen-toggle" @click="toggleFullScreen()">></span>
    </p>
    <img ref="map-element" :alt="map.name" :src="`resources/${map.mapImage}`" class="map-image">
    <img v-if="map.avatarImage" :alt="map.name" :src="`resources/${map.avatarImage}`" class="avatar-image"
         style="visibility: hidden;">
  </div>
  <dialog ref="map-dialog" class="map-dialog">
  </dialog>
</template>
<script lang="ts" setup>
import {onMounted, onUpdated, useTemplateRef} from "vue";
import {useLocationMap} from "ui/Composables/LocationMap.ts";

const {map, currentMap, mapDialog, prepareMap, toggleFullScreen} = useLocationMap();

const mapRef = useTemplateRef('map-element');
const dialogRef = useTemplateRef('map-dialog');

onMounted(() => {
  currentMap.value = mapRef.value;
  mapDialog.value = dialogRef.value;
  prepareMap(map.value, false);
});

onUpdated(() => prepareMap(map.value, true))

</script>