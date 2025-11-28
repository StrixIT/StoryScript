<template>
  <game-container :key="reloadKey"></game-container>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {reloadKey} = storeToRefs(store);
</script>