<template>
  <div class="container-fluid body-content">
    <div class="row">
      <div v-if="game.state === 'Play'" id="party-container" :class="{ 'col-4': showCharacterPane }">
        <party></party>
      </div>
      <div id="location-container"
           :class="{ 'col-8': game.state === 'Play' && showCharacterPane, 'col-12': game.state !== 'Play' || !showCharacterPane }">
        <div v-if="!game.state">
          {{ texts.loading }}
        </div>

        <div v-if="game.state === 'Play'">
          <encounter></encounter>
          <location-text></location-text>
          <location-visual :hidden="true"></location-visual>
          <action-log></action-log>
          <ground></ground>
          <exploration></exploration>
          <enemy></enemy>
        </div>

        <intro></intro>
        <create-character></create-character>
        <level-up></level-up>
        <game-over></game-over>
        <victory></victory>
      </div>
    </div>
    <div v-if="game.state === 'Play'" class="row">
      <div class="col-12">
        <combinations></combinations>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const store = useStateStore();
const {game, useEquipment, useBackpack, useQuests, useCharacterSheet} = storeToRefs(store);
const {texts} = store.services;

const showCharacterPane = computed(() => useCharacterSheet.value || useEquipment.value || useBackpack.value || useQuests.value)

</script>