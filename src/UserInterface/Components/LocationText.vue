<template>
  <div v-if="show()" class="box-container" id="location">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [game.currentLocation.name])"></div>
    <div textFeatures>
      <div v-html="game.currentLocation.description"></div>
    </div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in game.currentLocation.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
  import {computed} from "@angular/core";
  import {useStateStore} from "vue/StateStore.ts";
  import {storeToRefs} from "pinia";

  const store = useStateStore();
  const {game, texts} = storeToRefs(store);
  
  const show = computed(() => game.value.currentLocation.description || !game.value.currentLocation.features?.collectionPicture);
</script>