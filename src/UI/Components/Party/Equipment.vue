<template>
  <div v-if="store.showEquipment(character)" class="character-equipment box-container">
    <collapsible :headerClass="'box-title'" :text="texts.equipmentHeader">
      <div class="equipment-panel">
        <equipment-slot slot="head" :character="character"></equipment-slot>
        <equipment-slot slot="amulet" :character="character"></equipment-slot>
        <div class="row">
          <div class="col-4">
            <equipment-slot slot="hands" :character="character"></equipment-slot>
            <equipment-slot slot="rightHand" :character="character"></equipment-slot>
            <equipment-slot slot="rightRing" :character="character"></equipment-slot>
          </div>
          <div class="col-4 body-slot">
            <equipment-slot slot="body" :character="character"></equipment-slot>
          </div>
          <div class="col-4">
            <equipment-slot slot="hands" :character="character"></equipment-slot>
            <equipment-slot slot="leftHand" :character="character"></equipment-slot>
            <equipment-slot slot="leftRing" :character="character"></equipment-slot>
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
import {ICharacter} from "storyScript/Interfaces/character.ts";

const store = useStateStore();
const {useEquipment} = storeToRefs(store);
const {texts} = store.services;

const {character} = defineProps<{
  character?: ICharacter
}>();

useEquipment.value = true;

const customSlots = (): string[] => {
  const defaultSlots = Object.keys(new DefaultEquipment());
  return Object.keys(character.equipment).filter(e => defaultSlots.indexOf(e) === -1)
};

</script>