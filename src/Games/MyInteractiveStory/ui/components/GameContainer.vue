<template>
  <div>
    <navigation></navigation>
    <div class="container-fluid body-content">
      <div class="row">
        <div id="location-container"
             :class="{ 'col-8': game.state === 'Play' && showCharacterPane, 'col-12': game.state !== 'Play' || !showCharacterPane }">
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
import {computed} from "vue";

const store = useStateStore();
const {game, useEquipment, useBackpack, useQuests, useCharacterSheet} = storeToRefs(store);
const {texts} = store.services;

const showCharacterPane = computed(() => {
  return useCharacterSheet.value || useEquipment.value || useBackpack.value || useQuests.value;
});

</script>