<template>
  <div class="row">
    <ul class="list-unstyled combat-actions">
      <li v-for="action of actions">
        <button :class="store.getButtonClass(action)" 
                :disabled="!enabled" 
                class="btn" 
                type="button"
                @click="store.executeAction(action)">{{ action[1].text }}
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {IAction} from "storyScript/Interfaces/action.ts";

const store = useStateStore();

const {actions} = defineProps<{
  actions: [string, IAction][],
  enabled: boolean,
}>();

</script>