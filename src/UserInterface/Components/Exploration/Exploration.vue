<template>
  <div id="exploration">
    <div v-if="actionsPresent()" class="box-container" id="exploration-actions">
      <div class="box-title">{{ texts.actions }}</div>
      <ul v-if="!confirmAction" class="list-unstyled">
        <li v-for="action of location.activeActions.filter(a => !checkStatus(a, ActionStatus.Unavailable))" class="inline">
          <button type="button" class="btn" :class="getButtonClass(action)" @click="execute(action)" :disabled="disableActionButton(action)">{{ action[1].text }}</button>
        </li>
      </ul>
      <div v-else>
        <p v-html="confirmAction[1].confirmationText"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button type="button" class="btn btn-primary" @click="cancelAction()">{{ texts.cancelAction }}</button>
            <button type="button" class="btn btn-warning" @click="execute(confirmAction)">{{ texts.confirmAction }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!enemiesPresent(game)" class="box-container" id="exploration-destinations">
      <div class="box-title">{{ texts.destinations }}</div>
      <ul class="list-unstyled">
        <li v-for="destination of location.activeDestinations" :class="`inline ${destination.visited ? '' : 'not-'}visited`">
          <div v-for="barrier of destination.barriers" class="barrier">
            <button v-if="!barrier[1].actions?.length" class="btn btn-outline-primary">{{ barrier[1].name  }}</button>
            <div v-else class="dropdown">
              <button class="btn btn-outline-primary dropdown-toggle" type="button" @click="dropDownExpanded = !dropDownExpanded" :aria-expanded="dropDownExpanded">
                {{ barrier[1].name }}
              </button>
              <ul class="dropdown-menu action-select" :class="dropDownMenuActive" v-if="dropDownExpanded">
                <li v-for="action of barrier[1].actions"><a class="dropdown-item" href="#" @click="executeBarrierAction(barrier, action, destination)">{{ action[1].text }}</a></li>
              </ul>
            </div>
          </div>
          <button type="button" class="btn btn-info" :class="destination.style" @click="changeLocation(<string>destination.target)" :disabled="!destination.target || destination.barriers?.length > 0">
            <span v-if="(<any>destination).isPreviousLocation" class="back-label">{{ texts.back }}</span>
            {{ destination.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {enemiesPresent, getButtonClass, executeAction} from "vue/Helpers.ts";
import {isEmpty} from "storyScript/utilityFunctions.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {computed, ref} from "vue";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {IDestination} from "storyScript/Interfaces/destination.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, dataService} = store.services;

const dropDownExpanded = ref(false);
const confirmAction = ref<IAction>(null);

const dropDownMenuActive = computed(() => dropDownExpanded.value ? 'dropdown-menu-active' : '');

const { location } = defineProps<{
  location?: ICompiledLocation
}>();

const checkStatus = (action: IAction, status: ActionStatus) => 
    typeof action[1].status === 'function' 
        ? (<any>action[1]).status(game) == status 
        : action[1].status == undefined ? false : action[1].status == status;

const actionsPresent = () => location && !enemiesPresent(game.value) && !isEmpty(location.actions);

const disableActionButton = (a) => checkStatus(a, ActionStatus.Disabled);

const cancelAction = () => confirmAction.value = undefined;

const executeBarrierAction = (barrier: [string, IBarrier], action: [string, IBarrierAction], destination: IDestination): void => {
  if (game.value.combinations.tryCombine(barrier[1]).success || game.value.combinations.activeCombination) {
    return;
  }

  action[1].execute(game.value, barrier, destination);
  barrier[1].actions.delete(barrier[1].actions.find(([k, _]) => k === action[0]));
  dataService.saveGame(game.value);
}

const execute = (action: IAction): void => {
  if (action[1].confirmationText && !confirmAction) {
    confirmAction.value = action;
    return;
  }

  confirmAction.value = undefined;
  executeAction(game.value, action, this, () => dataService.saveGame(game.value));
}

const changeLocation = (location: string) => game.value.changeLocation(location, true);

</script>