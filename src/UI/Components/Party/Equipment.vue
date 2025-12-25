<template>
  <div v-if="store.showEquipment(character)" class="character-equipment box-container">
    <collapsible :text="texts.equipmentHeader" :headerClass="'box-title'">
      <div class="equipment-panel">
        <equipment-slot slot="head" :character="character"></equipment-slot>
        <equipment-slot slot="amulet" :character="character"></equipment-slot>
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
        <equipment-slot slot="legs" :character="character"></equipment-slot>
        <equipment-slot slot="feet" :character="character"></equipment-slot>
        <equipment-slot v-for="slot of customSlots()" :slot="slot" :character="character"></equipment-slot>
      </div>
    </collapsible>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {DefaultEquipment} from "storyScript/Interfaces/defaultEquipment.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

const store = useStateStore();
const {useEquipment} = storeToRefs(store);
const {texts, itemService, characterService} = store.services;

const {character} = defineProps<{
  character?: ICharacter
}>();

useEquipment.value = true;

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