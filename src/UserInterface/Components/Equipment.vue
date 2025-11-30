<template>
  <div v-if="showEquipment(character)" class="character-equipment box-container">
    <collapsible :text="texts.equipmentHeader" :class="'box-title'"></collapsible>
    <div class="equipment-panel">
      <div v-if="isSlotUsed('head')" class="row">
        <div class="col-12">
          <div>
            {{ texts.head }}
          </div>
          <div class="item-box" @click="unequipItem(character.equipment.head)">
            {{ getItemName(character.equipment.head) }}
          </div>
        </div>
      </div>
      <div v-if="isSlotUsed('amulet')" class="row">
        <div class="col-12">
          <div>
            {{ texts.amulet }}
          </div>
          <div class="item-box" @click="unequipItem(character.equipment.amulet)">
            {{ getItemName(character.equipment.amulet) }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <span v-if="isSlotUsed(['hands', 'rightHand', 'rightRing'])">{{ texts.rightHand }}</span>
        </div>
        <div class="col-6">
          <span v-if="isSlotUsed('body')">{{ texts.body }}</span>
        </div>
        <div class="col-3">
          <span v-if="isSlotUsed(['hands', 'leftHand', 'leftRing'])">{{ texts.leftHand }}</span>
        </div>
        <div class="col-3">
          <div v-if="isSlotUsed('hands')" class="item-box" @click="unequipItem(character.equipment.hands)">
            {{ getItemName(character.equipment.hands) }}
          </div>
          <div v-if="isSlotUsed('rightHand')" :class="{ 'side-borders' : isSlotUsed(['hands', 'rightRing']) }"
               class="item-box"
               @click="unequipItem(character.equipment.rightHand)">{{ getItemName(character.equipment.rightHand) }}
          </div>
          <div v-if="isSlotUsed('rightRing')" class="item-box" @click="unequipItem(character.equipment.rightRing)">
            {{ getItemName(character.equipment.rightRing) }}
          </div>
        </div>
        <div class="col-6">
          <div v-if="isSlotUsed(['rightHand', 'leftHand']) && isSlotUsed('hands')" class="item-box no-border"></div>
          <div v-if="isSlotUsed('body')" class="item-box" @click="unequipItem(character.equipment.body)">
            {{ getItemName(character.equipment.body) }}
          </div>
        </div>
        <div class="col-3">
          <div v-if="isSlotUsed('hands')" class="item-box" @click="unequipItem(character.equipment.hands)">
            {{ getItemName(character.equipment.hands) }}
          </div>
          <div v-if="isSlotUsed('leftHand')" :class="{ 'side-borders' : isSlotUsed(['hands', 'leftRing']) }"
               class="item-box"
               @click="unequipItem(character.equipment.leftHand)">{{ getItemName(character.equipment.leftHand) }}
          </div>
          <div v-if="isSlotUsed('leftRing')" class="item-box" @click="unequipItem(character.equipment.leftRing)">
            {{ getItemName(character.equipment.leftRing) }}
          </div>
        </div>
      </div>
      <div v-if="isSlotUsed('legs')" class="row">
        <div class="col-12">
          <div>
            {{ texts.legs }}
          </div>
          <div class="item-box" @click="unequipItem(character.equipment.legs)">
            {{ getItemName(character.equipment.legs) }}
          </div>
        </div>
      </div>
      <div v-if="isSlotUsed('feet')" class="row">
        <div class="col-12">
          <div>
            {{ texts.feet }}
          </div>
          <div class="item-box" @click="unequipItem(character.equipment.feet)">
            {{ getItemName(character.equipment.feet) }}
          </div>
        </div>
      </div>
      <div v-for="slot of customSlots()" class="row">
        <div v-if="isSlotUsed(slot)" class="col-12">
          <div>
            {{ texts[slot] }}
          </div>
          <div class="item-box" @click="unequipItem(character.equipment[slot])">
            {{ getItemName(character.equipment[slot]) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {DefaultEquipment} from "storyScript/Interfaces/defaultEquipment.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {showEquipment} from "vue/Helpers.ts";
import {ref} from "vue";

const store = useStateStore();
const {texts, useEquipment} = storeToRefs(store);

const {character} = defineProps<{
  character?: ICharacter
}>();

useEquipment.value = true;

const isCollapsed = ref(false);
const itemService = store.getItemService();
const characterService = store.getCharacterService();

const customSlots = (): string[] => {
  const defaultSlots = Object.keys(new DefaultEquipment());
  return Object.keys(character.equipment).filter(e => defaultSlots.indexOf(e) === -1)
};

const getItemName = (item: IItem): string => itemService.getItemName(item);

const unequipItem = (item: IItem): boolean => itemService.unequipItem(character, item);

const isSlotUsed = (slot: string | string[]): boolean => {
  const slots = Array.isArray(slot) ? slot : [slot];
  return slots.find(s => characterService.isSlotUsed(character, s)) !== undefined;
}

</script>