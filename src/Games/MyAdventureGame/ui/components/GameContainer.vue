<template>
  <div>
    <navigation></navigation>
    <div class="container-fluid body-content">
      <div class="row">
        <div v-if="game?.state === 'Play'" id="party-container" :class="{ 'col-4': showCharacterPane }">
          <div v-for="character of game.party.characters">
            <backpack :character="character"></backpack>
          </div>
        </div>
        <div id="location-container" :class="{ 'col-8': game.state === 'Play' && showCharacterPane, 'col-12': game.state !== 'Play' || !showCharacterPane }">
          <div v-if="!game.state">
            {{ texts.loading }}
          </div>

          <div v-if="game.state === 'Play'">
            <location-text :location="game.currentLocation" :combinations="game.combinations"></location-text>
          </div>
        </div>
      </div>
      <div v-if="game.state === 'Play'" class="row">
        <div class="col-12">
          <combinations :combinations="game.combinations"></combinations>
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
const {game, texts, useEquipment, useBackpack, useQuests, useCharacterSheet} = storeToRefs(store);

const showCharacterPane = computed(() => useCharacterSheet.value || useEquipment.value || useBackpack.value || useQuests.value)

</script>