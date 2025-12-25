<template>
  <div v-if="!enemiesPresent && itemsPresent" id="exploration-onground" class="box-container">
    <div class="box-title">{{ texts.onTheGround }}</div>
    <ul class="list-unstyled">
      <li v-for="item of activeItems"
          :class="game.combinations.getCombineClass(item)"
          @click="itemService.pickupItem(game.activeCharacter, item)">
        {{ itemService.getItemName(item) }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const store = useStateStore();
const {game, useGround, enemiesPresent, activeItems} = storeToRefs(store);
const {texts, itemService} = store.services;
useGround.value = true;

const itemsPresent = computed(() => activeItems.value.length > 0);

</script>