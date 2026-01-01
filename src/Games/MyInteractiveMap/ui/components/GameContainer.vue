<template>
  <div class="container-fluid body-content">
    <div class="row">
      <div class="col-6">
        <location-map></location-map>
      </div>
      <div id="location-container" class="col-6">
        <div v-if="!game.state">
          {{ texts.loading }}
        </div>

        <div v-if="game.state === 'Play'">
          <location-text></location-text>
          <exploration></exploration>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

</script>