<template>
  <div v-if="show" id="location" class="box-container">
    <div class="box-title" v-html="texts.format(texts.youAreHere, [game.currentLocation.name])"></div>
    <img v-if="game.currentLocation.picture"
         :alt="game.currentLocation.name"
         :src="game.currentLocation.picture"
         class="location-picture"/>
    <div ref="description"
         @click="event => click(event)"
         @mouseout="event => mouseOut(event)"
         @mouseover="event => mouseOver(event)"
         v-html="descriptionToShow"></div>
    <ul id="location-log" class="list-unstyled">
      <li v-for="message in game.currentLocation.log" v-html="message"></li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore, useTextFeatures} from 'storyScript';
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;
const {show, descriptionToShow, click, mouseOver, mouseOut} = useTextFeatures();

</script>