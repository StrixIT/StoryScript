<template>
  <div>
    <navigation></navigation>
    <div class="container-fluid body-content">
      <div class="row">
        <div class="col-6">
          <location-map :map="game.currentMap" :location="game.currentLocation"></location-map>
        </div>
        <div id="location-container" class="col-6">
          <div v-if="!game.state">
            {{ texts.loading }}
          </div>

          <div v-if="game.state === 'Play'">
            <location-text :location="game.currentLocation"></location-text>
            <exploration :location="game.currentLocation"></exploration>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";

const store = useStateStore();
const {game, texts} = storeToRefs(store);

</script>