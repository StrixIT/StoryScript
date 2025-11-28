<template>
  <div>
    <navigation></navigation>
    <div class="container-fluid body-content">
<!--      <sound></sound>-->
    <div class="row">
      <div v-if="game?.state === 'Play'" id="party-container">
<!--        <party [party]="game.party"></party>-->
      </div>
      <div id="location-container">
        <div v-if="!game?.state">
          {{ texts?.loading }}
        </div>

        <div v-if="game?.state === 'Play'">
<!--          <encounter></encounter>-->
<!--          <location-text></location-text>-->
<!--          <location-visual></location-visual>-->
<!--          <action-log></action-log>-->
<!--          <ground></ground>-->
<!--          <exploration></exploration>-->
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
    <div v-if="game?.state === 'Play'" class="row">
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