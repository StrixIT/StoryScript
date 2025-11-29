<template>
  <div>
    <navigation :isDevelopment="game.isDevelopment"></navigation>
    <div class="container-fluid body-content">
      <div class="row">
        <div v-if="game?.state === 'Play'" id="party-container">
          <party :party="game.party" :isDevelopment="game.isDevelopment"></party>
        </div>
        <div id="location-container">
          <div v-if="!game.state">
            {{ texts.loading }}
          </div>

          <div v-if="game.state === 'Play'">
            <!--          <encounter></encounter>-->
            <location-text :location="game.currentLocation"></location-text>
            <!--          <location-visual></location-visual>-->
            <action-log :log="game.actionLog"></action-log>
            <ground :items="game.currentLocation.activeItems"></ground>
            <exploration :location="game.currentLocation"></exploration>
            <!--          <enemy></enemy>-->
          </div>

          <!--        <intro></intro>-->
          <!--        <create-character></create-character>-->
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
          <!--        <combination></combination>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game, texts} = storeToRefs(store);

</script>