<template>
  <div>
    <navigation></navigation>
    <div class="container-fluid body-content">
      <div class="row">
        <div v-if="game.state === 'Play'" id="party-container" :class="{ 'col-4': showCharacterPane }">
          <party :party="game.party"></party>
        </div>
        <div id="location-container" :class="{ 'col-8': game.state === 'Play' && showCharacterPane, 'col-12': game.state !== 'Play' || !showCharacterPane }">
          <div v-if="!game.state">
            {{ texts.loading }}
          </div>

          <div v-if="game.state === 'Play'">
            <encounter :location="game.currentLocation" :combinations="game.combinations"></encounter>
            <location-text :location="game.currentLocation" :combinations="game.combinations"></location-text>
            <location-visual :hidden="true"></location-visual>
            <action-log :log="game.actionLog"></action-log>
            <ground :items="game.currentLocation.activeItems"></ground>
            <exploration :location="game.currentLocation"></exploration>
            <!--          <enemy></enemy>-->
          </div>

          <!--        <intro></intro>-->
          <create-character :state="game.state" :party="game.party" :sheet="game.createCharacterSheet"></create-character>
          <!-- TODO: how to make this work? -->
          <!--        @for (character of game.party?.characters; track character)-->
          <!--        {-->
          <!--        <level-up [character]="character"></level-up>-->
          <!--        }-->
          <!--        <game-over></game-over>-->
          <!--        <victory></victory>-->
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