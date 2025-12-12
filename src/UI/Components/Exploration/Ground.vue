<template>
  <div v-if="!enemiesPresent(game) && items?.length" id="exploration-onground" class="box-container">
    <div class="box-title">{{ texts.onTheGround }}</div>
    <ul class="list-unstyled">
      <li v-for="item of items" :class="getCombineClass(item)" @click="pickupItem(item)">
        {{ getItemName(item) }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {enemiesPresent} from "ui/Helpers.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IItem} from "storyScript/Interfaces/item.ts";

const store = useStateStore();
const {game, useGround} = storeToRefs(store);
const {texts, itemService} = store.services;

const { items } = defineProps<{
  items?: IItem[]
}>();

useGround.value = true;

const getCombineClass = (barrier: IBarrier): string => game.value.combinations.getCombineClass(barrier);

const getItemName = (item: IItem): string => itemService.getItemName(item);

const pickupItem = (item: IItem): boolean => itemService.pickupItem(game.value.activeCharacter, item);

</script>