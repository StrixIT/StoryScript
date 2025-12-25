<template>
  <div v-if="combineActions.length" id="combinations" class="box-container">
    <div class="box-title">{{ texts.combinations }}</div>
    <div class="row">
      <ul class="list-unstyled col-3">
        <li>
          <button v-for="c of combineActions" 
                  :class="getCombineClass(c)" 
                  class="btn" 
                  type="button"
                  @click="combinationService.setActiveCombination(c)">{{ c.text }}
          </button>
        </li>
      </ul>
      <div class="col-9">
        <p v-if="game.combinations.combinationResult.text" class="combination-result-text">
          {{ game.combinations.combinationResult.text }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {ICombinationAction} from "storyScript/Interfaces/combinations/combinationAction.ts";
import {ref} from "vue";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, combinationService} = store.services;

const combineActions = ref<ICombinationAction[]>(combinationService.getCombinationActions());

const getCombineClass = (action: ICombinationAction): string => game.value.combinations.activeCombination && game.value.combinations.activeCombination.selectedCombinationAction === action ? 'btn-outline-dark' : 'btn-dark';

</script>