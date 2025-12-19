<template>
  <div id="action-log" class="box-container">
    <div class="box-title">{{ texts.messages }}</div>
    <ul class="action-log list-unstyled">
      <li v-for="message of game.actionLog">{{ message }}</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

</script>