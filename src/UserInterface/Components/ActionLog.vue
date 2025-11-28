<template>
  <div class="box-container" id="action-log">
    <div class="box-title">{{ texts.messages }}</div>
    <ul class="action-log list-unstyled">
      <li v-for="message of game.actionLog">{{ message }}</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game, texts} = storeToRefs(store);
</script>