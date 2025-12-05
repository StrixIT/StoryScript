<template>
  <conversation v-if="game.playState === PlayState.Conversation" :playState="game.playState" :person="game.person"></conversation>
  <trade v-if="game.playState === PlayState.Trade" :playState="game.playState" :trade="game.trade" :character="game.activeCharacter"></trade>
  <combat v-if="game.playState === PlayState.Combat"  :playState="game.playState" :combat="game.combat" :combatActions="game.currentLocation.combatActions" :combaLog="game.combatLog" ></combat>
  <description v-if="game.playState === PlayState.Description" :playState="game.playState"></description>
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
            <enemy :enemies="game.currentLocation.activeEnemies" :combinations="game.combinations"></enemy>
          </div>

          <intro v-if="game.state === GameState.Intro"></intro>
          <create-character :state="game.state" :party="game.party" :sheet="game.createCharacterSheet"></create-character>
          <!-- TODO: how to make this work? -->
          <level-up v-if="game.state === GameState.LevelUp" v-for="character of game.party?.characters" :character="character" :sheet="game.createCharacterSheet"></level-up>
          <game-over v-if="game.state === GameState.GameOver"></game-over>
          <victory v-if="game.state === GameState.Victory" :score="game.party.score"></victory>
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
import {GameState, PlayState} from "storyScript/Interfaces/storyScript.ts";

const store = useStateStore();
const {game, useEquipment, useBackpack, useQuests, useCharacterSheet} = storeToRefs(store);
const {texts} = store.services;

const showCharacterPane = computed(() => useCharacterSheet.value || useEquipment.value || useBackpack.value || useQuests.value)

</script>