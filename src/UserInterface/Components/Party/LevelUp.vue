<template>
  <div id="level-up" class="container-fluid">
    <div class="col-12">
      <h2>{{ texts.levelUp }}</h2>
      <p>{{ texts.format(texts.levelUpDescription, [character.level.toString()]) }}</p>
      <build-character :sheet="sheet"></build-character>
      <button v-if="sheet.currentStep >= sheet.steps.length - 1" :disabled="!distributionDone()" class="btn btn-primary"
              type="button" @click="levelUp()">{{ texts.completeLevelUp }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {ICreateCharacter} from "storyScript/Interfaces/createCharacter/createCharacter.ts";

const store = useStateStore();
const {texts, characterService} = store.services;

const {character, sheet} = defineProps<{
  character: ICharacter;
  sheet: ICreateCharacter;
}>();

const distributionDone = (): boolean => characterService.distributionDone(sheet, null);

const levelUp = (): ICharacter => characterService.levelUp(character);

</script>