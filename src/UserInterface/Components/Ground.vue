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
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {enemiesPresent} from "vue/Helpers.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

const store = useStateStore();
const {game, texts} = storeToRefs(store);
const itemService = store.getItemService();

const { items } = defineProps<{
  items?: IItem[]
}>();

const getCombineClass = (barrier: IBarrier): string => game.value.combinations.getCombineClass(barrier);

const getItemName = (item: IItem): string => itemService.getItemName(item);

const pickupItem = (item: IItem): boolean => itemService.pickupItem(game.value.activeCharacter, item);

</script>