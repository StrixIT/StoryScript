<template>
  <div id="create-character" class="container-fluid">
    <div v-for="(step, index) of sheet.steps" :hidden="sheet.currentStep !== index">
      <div v-if="step.description" class="step-description" v-html="step.description"></div>
      <div v-for="question of step.questions" class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text">{{ question.question }}</label>
        </div>
        <select class="custom-select" v-model="question.selectedEntry" @change="sheet.nextStep(sheet, false)">
          <option v-for="entry of question.entries" :value="entry" >{{ entry.text }}</option>
        </select>
      </div>

      <div v-for="attribute of step.attributes">
        <div v-if="attribute.entries.length > 1">
          <span class="attribute-header">{{ attribute.question }}</span>
        </div>
        <div v-for="entry of attribute.entries" class="input-group mb-3">
          <div class="input-group-prepend">
            <label v-if="attribute.entries.length !== 1" class="input-group-text">{{ texts.titleCase(entry.attribute) }}</label>
            <label v-if="attribute.entries.length === 1" class="input-group-text">{{ attribute.question }}</label>
          </div>
          <input v-if="!entry.min && !entry.max" class="form-control" type="text" v-model="entry.value" />
          <input v-if="entry.min || entry.max" class="form-control" type="number" min="{{ entry.min }}" max="{{ entry.max }}" v-model="entry.value" @blur="limitInput($event, attribute, entry)" />
        </div>
      </div>
      
      <button v-if="sheet.currentStep < sheet.steps.length - 1 && !sheet.steps[sheet.currentStep].finish" type="button" class="btn btn-primary" :disabled="!distributionDone(step)" @click="sheet.nextStep(sheet)">{{ texts.nextQuestion }}</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {ICreateCharacterAttribute} from "storyScript/Interfaces/createCharacter/createCharacterAttribute.ts";
import {ICreateCharacterAttributeEntry} from "storyScript/Interfaces/createCharacter/createCharacterAttributeEntry.ts";
import {ICreateCharacterStep} from "storyScript/Interfaces/createCharacter/createCharacterStep.ts";
import type {ICreateCharacter} from "storyScript/Interfaces/createCharacter/createCharacter.ts";

const store = useStateStore();
const {texts} = storeToRefs(store);
const characterService = store.getCharacterService();

const {sheet} = defineProps<{
  sheet?: ICreateCharacter
}>();

const limitInput = (event: any, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
  const value = parseInt(event.target.value);
  characterService.limitSheetInput(value, attribute, entry);
}

const distributionDone = (step: ICreateCharacterStep): boolean => characterService.distributionDone(sheet, step);
</script>