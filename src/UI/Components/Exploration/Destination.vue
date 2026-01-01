<template>
  <div v-for="barrier of destination.barriers" class="barrier">
    <button v-if="!barrier[1].actions?.length" class="btn btn-outline-primary">{{ barrier[1].name }}</button>
    <div v-else class="dropdown">
      <button :aria-expanded="dropDownExpanded"
              class="btn btn-outline-primary dropdown-toggle"
              type="button" @click="dropDownExpanded = !dropDownExpanded"
              @focusout="dropDownLoseFocus">
        {{ barrier[1].name }}
      </button>
      <ul
          v-if="dropDownExpanded"
          :class="dropDownMenuActive"
          class="dropdown-menu action-select"
          @mouseleave="mouseOverDropDown = false"
          @mouseover="mouseOverDropDown = true">
        <li v-for="action of barrier[1].actions">
          <a class="dropdown-item" href="#" @click="executeBarrierAction(barrier, action, destination)">
            {{ action[1].text }}
          </a>
        </li>
      </ul>
    </div>
  </div>
  <button :class="destination.style"
          :disabled="!destination.target || destination.barriers?.length > 0"
          class="btn btn-info"
          type="button"
          @click="game.changeLocation(destination.target, true)">
    <span v-if="(<any>destination).isPreviousLocation" class="back-label">{{ texts.back }}</span>
    {{ destination.name }}
  </button>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {IDestination} from "storyScript/Interfaces/destination.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, dataService} = store.services;

const {destination} = defineProps<{
  destination: IDestination
}>();

const dropDownExpanded = ref(false);
const mouseOverDropDown = ref(false);
const dropDownMenuActive = computed(() => dropDownExpanded.value ? 'dropdown-menu-active' : '');

const dropDownLoseFocus = () => {
  if (!mouseOverDropDown.value) {
    dropDownExpanded.value = false;
  }
}

const executeBarrierAction = (barrier: [string, IBarrier], action: [string, IBarrierAction], destination: IDestination): void => {
  if (game.value.combinations.tryCombine(barrier[1]).success || game.value.combinations.activeCombination) {
    return;
  }

  action[1].execute(game.value, barrier, destination);
  barrier[1].actions.delete(barrier[1].actions.find(([k, _]) => k === action[0]));
  dataService.saveGame(game.value);
  dropDownExpanded.value = false;
}

</script>