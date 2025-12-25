<template>
  <div id="exploration">
    <div v-if="!enemiesPresent && activeActions.length > 0" id="exploration-actions" class="box-container">
      <div class="box-title">{{ texts.actions }}</div>
      <ul v-if="!confirmAction" class="list-unstyled">
        <li v-for="action of activeActions.filter(a => !checkStatus(a, ActionStatus.Unavailable))" class="inline">
          <button :class="store.getButtonClass(action)" :disabled="checkStatus(action, ActionStatus.Disabled)"
                  class="btn"
                  type="button"
                  @click="execute(action)">{{ action[1].text }}
          </button>
        </li>
      </ul>
      <div v-else>
        <p v-html="confirmAction[1].confirmationText"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button class="btn btn-primary" type="button" @click="confirmAction = null">{{
                texts.cancelAction
              }}
            </button>
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
          <destination :destination="destination"></destination>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IAction} from "storyScript/Interfaces/action.ts";
import {ref} from "vue";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import Destination from "ui/Components/Exploration/Destination.vue";

const store = useStateStore();
const {game, enemiesPresent, activeActions, activeDestinations} = storeToRefs(store);
const {texts} = store.services;

const confirmAction = ref<[string, IAction]>(null);

const checkStatus = (action: [string, IAction], status: ActionStatus) =>
    typeof action[1].status === 'function'
        ? action[1].status(game.value) == status
        : action[1].status === undefined ? false : action[1].status == status;

const execute = (action: [string, IAction]): void => {
  if (action[1].confirmationText && !confirmAction.value) {
    confirmAction.value = action;
    return;
  }

  confirmAction.value = undefined;
  store.executeAction(action);
}

</script>