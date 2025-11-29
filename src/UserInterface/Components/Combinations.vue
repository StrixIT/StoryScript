<template>
  <div v-if="combineActions.length" id="combinations" class="box-container">
    <div class="box-title">{{ texts.combinations }}</div>
    <div class="row">
      <ul class="list-unstyled col-3">
        <li>
          <button v-for="c of combineActions" :class="getCombineClass(c)" class="btn" type="button"
                  @click="selectCombinationAction(c)">{{ c.text }}
          </button>
        </li>
      </ul>
      <div class="col-9">
        <p v-if="combinations.combinationResult.text" class="combination-result-text">
          {{ combinations.combinationResult.text }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {ICombinationAction} from "storyScript/Interfaces/combinations/combinationAction.ts";
import {ref} from "vue";
import {IGameCombinations} from "storyScript/Interfaces/combinations/gameCombinations.ts";

const store = useStateStore();
const {texts} = storeToRefs(store);
const combinationService = store.getCombinationService()

const {combinations} = defineProps<{
  combinations?: IGameCombinations
}>();

const combineActions = ref<ICombinationAction[]>(combinationService.getCombinationActions());

const selectCombinationAction = (combination: ICombinationAction) => combinationService.setActiveCombination(combination);

const getCombineClass = (action: ICombinationAction): string => combinations.activeCombination && combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';

</script>