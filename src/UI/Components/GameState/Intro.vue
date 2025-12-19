<template>
  <div id="intro" class="box-container">
    <h2>Game introduction</h2>
    <p>Please copy the IntroComponent.html file to your game and add your introduction here.</p>
    <button class="btn btn-primary" type="button" @click="endIntro()">{{ texts.skipIntro }}</button>
  </div>
</template>
<script lang="ts" setup>

import {useStateStore} from "ui/StateStore.ts";

const store = useStateStore();
const {texts, gameService} = store.services;

const endIntro = (): void => gameService.restart(true);

</script>