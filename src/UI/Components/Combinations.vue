<template>
  <div v-if="combineActions.length" id="combinations" class="box-container">
    <div class="box-title">{{ texts.combinations }}</div>
    <div class="row">
      <ul class="list-unstyled col-lg-12 col-xl-5 col-xxl-4 combination-actions">
        <li>
          <button v-for="c of combineActions"
                  :class="getCombineClass(c)"
                  class="btn combination-button"
                  type="button"
                  @click="combinationService.setActiveCombination(c)">
            <img v-if="c.picture" :alt="c.text" :src="`resources/${c.picture}`"/>
            {{ c.text }}
          </button>
        </li>
      </ul>
      <div class="col-lg-12 col-xl-7 col-xxl-8">
        <p v-if="game.combinations.combinationResult.text" class="combination-result-text"
           v-html="game.combinations.combinationResult.text"></p>
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

const combineActions = ref(combinationService.combinationActions);

const getCombineClass = (action: ICombinationAction): string => game.value.combinations.activeCombination?.selectedCombinationAction.text === action.text ? 'btn-outline-dark' : 'btn-dark';

</script>