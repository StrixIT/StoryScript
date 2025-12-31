<template>
  <div v-if="isSlotUsed(slot)" class="row">
    <div class="col-12">
      <div v-if="!inline">
        {{ texts[slot] }}
      </div>
      <div class="item-box" @click="itemService.unequipItem(character, character.equipment[slot])" :class="!inline || character.equipment[slot] ? '' : 'empty-slot'">
        {{ itemService.getItemName(character.equipment[slot]) ?? (inline ? texts[slot] : null) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {ICharacter} from "storyScript/Interfaces/storyScript.ts";

const store = useStateStore();
const {texts, itemService, characterService} = store.services;

const {character, slot} = defineProps<{
  character: ICharacter;
  slot: string;
  inline?: boolean;
}>();

const isSlotUsed = (slot: string | string[]): boolean => {
  const slots = Array.isArray(slot) ? slot : [slot];
  return slots.find(s => characterService.isSlotUsed(character, s)) !== undefined;
}

</script>