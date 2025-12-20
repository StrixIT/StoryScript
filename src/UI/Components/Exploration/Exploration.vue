<template>
  <div id="exploration">
    <div v-if="!enemiesPresent && activeActions.length > 0" id="exploration-actions" class="box-container">
      <div class="box-title">{{ texts.actions }}</div>
      <ul v-if="!confirmAction" class="list-unstyled">
        <li v-for="action of activeActions.filter(a => !checkStatus(a, ActionStatus.Unavailable))" class="inline">
          <button :class="store.getButtonClass(action)" :disabled="disableActionButton(action)" class="btn"
                  type="button"
                  @click="execute(action)">{{ action[1].text }}
          </button>
        </li>
      </ul>
      <div v-else>
        <p v-html="confirmAction[1].confirmationText"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button class="btn btn-primary" type="button" @click="cancelAction()">{{ texts.cancelAction }}</button>
            <button class="btn btn-warning" type="button" @click="execute(confirmAction)">{{
                texts.confirmAction
              }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!enemiesPresent" id="exploration-destinations" class="box-container">
      <div class="box-title">{{ texts.destinations }}</div>
      <ul class="list-unstyled">
        <li v-for="destination of activeDestinations" :class="`inline ${destination.visited ? '' : 'not-'}visited`">
          <div v-for="barrier of destination.barriers" class="barrier">
            <button v-if="!barrier[1].actions?.length" class="btn btn-outline-primary">{{ barrier[1].name }}</button>
            <div v-else class="dropdown">
              <button :aria-expanded="dropDownExpanded" class="btn btn-outline-primary dropdown-toggle"
                      type="button" @click="dropDownExpanded = !dropDownExpanded" @focusout="dropDownLoseFocus">
                {{ barrier[1].name }}
              </button>
              <ul 
                  v-if="dropDownExpanded" 
                  :class="dropDownMenuActive" 
                  class="dropdown-menu action-select" 
                  @mouseover="mouseOverDropDown = true" 
                  @mouseleave="mouseOverDropDown = false">
                <li v-for="action of barrier[1].actions"><a class="dropdown-item" href="#"
                                                            @click="executeBarrierAction(barrier, action, destination)">{{
                    action[1].text
                  }}</a></li>
              </ul>
            </div>
          </div>
          <button :class="destination.style" :disabled="!destination.target || destination.barriers?.length > 0"
                  class="btn btn-info"
                  type="button"
                  @click="changeLocation(<string>destination.target)">
            <span v-if="(<any>destination).isPreviousLocation" class="back-label">{{ texts.back }}</span>
            {{ destination.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IAction} from "storyScript/Interfaces/action.ts";
import {computed, ref} from "vue";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {IDestination} from "storyScript/Interfaces/destination.ts";
import {useActiveEntityWatcher} from "ui/Composables/ActiveEntityWatcher.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, dataService} = store.services;
const {enemiesPresent, activeActions, activeDestinations} = useActiveEntityWatcher(game);

const dropDownExpanded = ref(false);
const mouseOverDropDown = ref(false);
const confirmAction = ref<[string, IAction]>(null);

const dropDownLoseFocus = () => {
  if (!mouseOverDropDown.value) {
    dropDownExpanded.value = false;
  }
}

const dropDownMenuActive = computed(() => dropDownExpanded.value ? 'dropdown-menu-active' : '');

const checkStatus = (action: [string, IAction], status: ActionStatus) =>
    typeof action[1].status === 'function'
        ? (<any>action[1]).status(game) == status
        : action[1].status === undefined ? false : action[1].status == status;

const disableActionButton = (a) => checkStatus(a, ActionStatus.Disabled);

const cancelAction = () => confirmAction.value = undefined;

const executeBarrierAction = (barrier: [string, IBarrier], action: [string, IBarrierAction], destination: IDestination): void => {
  if (game.value.combinations.tryCombine(barrier[1]).success || game.value.combinations.activeCombination) {
    return;
  }

  action[1].execute(game.value, barrier, destination);
  barrier[1].actions.delete(barrier[1].actions.find(([k, _]) => k === action[0]));
  dataService.saveGame(game.value);
  dropDownExpanded.value = false;
}

const execute = (action: [string, IAction]): void => {
  if (action[1].confirmationText && !confirmAction) {
    confirmAction.value = action;
    return;
  }

  confirmAction.value = undefined;
  store.executeAction(action);
}

const changeLocation = (location: string) => game.value.changeLocation(location, true);

</script>