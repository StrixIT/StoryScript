<template>
  <div v-if="!enemiesPresent && itemsPresent" id="exploration-onground" class="box-container">
    <div class="box-title">{{ texts.onTheGround }}</div>
    <ul class="list-unstyled">
      <li v-for="item of activeItems" :class="getCombineClass(item)" @click="pickupItem(item)">
        {{ getItemName(item) }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {computed} from "vue";

const store = useStateStore();
const {game, useGround, enemiesPresent, activeItems} = storeToRefs(store);
const {texts, itemService} = store.services;
useGround.value = true;

const itemsPresent = computed(() => activeItems.value.length > 0);

const getCombineClass = (barrier: IBarrier): string => game.value.combinations.getCombineClass(barrier);

const getItemName = (item: IItem): string => itemService.getItemName(item);

const pickupItem = (item: IItem): boolean => itemService.pickupItem(game.value.activeCharacter, item);

</script>