<template>
  <div class="box-container" id="action-log">
    <div class="box-title">{{ texts.messages }}</div>
    <ul class="action-log list-unstyled">
      <li v-for="message of log">{{ message }}</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";

const store = useStateStore();
const {texts} = store.services;

const { log } = defineProps<{
  log?: string[]
}>();

</script>