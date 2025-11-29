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
          <div v-for="barrier of destination.barriers?.map(b => b[1])" class="barrier">
            <button v-if="!barrier.actions?.length" class="btn btn-outline-primary">{{ barrier.name }}</button>
<!--            <div v-else ngbDropdown class="d-inline-block" class="action-select">-->
<!--              <button class="btn btn-outline-primary" id="barrierdropdown" ngbDropdownToggle>{{ barrierEntry.name }}</button>-->
<!--              <div ngbDropdownMenu aria-labelledby="barrierdropdown">-->
<!--                @for (action of barrier[1].actions; track action)-->
<!--                {-->
<!--                <button ngbDropdownItem (click)="executeBarrierAction(barrier, action, destination)">{{ action[1].text }}</button>-->
<!--                }-->
<!--              </div>-->
<!--            </div>-->
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
import {ref} from "vue";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";

const store = useStateStore();
const {game, texts} = storeToRefs(store);

const confirmAction = ref<IAction>(null);

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

const execute = (action: IAction): void => {
  if (action[1].confirmationText && !confirmAction) {
    confirmAction.value = action;
    return;
  }

  confirmAction.value = undefined;
  executeAction(game.value, action, this, store.saveGame);
}

const changeLocation = (location: string) => store.update(() => game.value.changeLocation(location, true));

</script>