<template>
  <div id="create-character" class="container-fluid">
    <div v-for="(step, index) of sheet.steps" :hidden="sheet.currentStep !== index">
      <div v-if="step.description" class="step-description" v-html="step.description"></div>
      <div v-for="question of step.questions" class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text">{{ question.question }}</label>
        </div>
        <select v-model="question.selectedEntry" class="custom-select" @change="sheet.nextStep(sheet, false)">
          <option v-for="entry of question.entries" :value="entry">{{ entry.text }}</option>
        </select>
      </div>

      <div v-for="attribute of step.attributes">
        <div v-if="attribute.entries.length > 1">
          <span class="attribute-header">{{ attribute.question }}</span>
        </div>
        <div v-for="entry of attribute.entries" class="input-group mb-3">
          <div class="input-group-prepend">
            <label v-if="attribute.entries.length !== 1" class="input-group-text">{{
                texts.titleCase(entry.attribute)
              }}</label>
            <label v-if="attribute.entries.length === 1" class="input-group-text">{{ attribute.question }}</label>
          </div>
          <input v-if="!entry.min && !entry.max" v-model="entry.value" class="form-control" type="text"/>
          <input v-if="entry.min || entry.max" 
                 v-model="entry.value" 
                 class="form-control" 
                 max="{{ entry.max }}"
                 min="{{ entry.min }}" 
                 type="number"
                 @blur="characterService.limitSheetInput(parseInt(($event.target as any).value), attribute, entry)"/>
        </div>
      </div>

      <button v-if="sheet.currentStep < sheet.steps.length - 1 && !sheet.steps[sheet.currentStep].finish" 
              :disabled="!characterService.distributionDone(sheet, step)"
              class="btn btn-primary" type="button"
              @click="sheet.nextStep(sheet)">{{ texts.nextQuestion }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import type {ICreateCharacter} from "storyScript/Interfaces/createCharacter/createCharacter.ts";

const store = useStateStore();
const {texts, characterService} = store.services;

const {sheet} = defineProps<{
  sheet?: ICreateCharacter
}>();

</script>