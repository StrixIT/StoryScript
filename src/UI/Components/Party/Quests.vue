<template>
  <div v-if="!isEmpty(quests)" id="character-quests" class="box-container">
    <collapsible :headerClass="'box-title'" :text="texts.quests">
      <div id="quest-panel">
        <div v-if="showActiveQuests()">
          <h4>{{ texts.currentQuests }}</h4>
          <ul>
            <li v-for="quest of currentQuests()">
              <span>{{ quest.name }}</span>
              <div v-html="characterService.questStatus(quest)"></div>
            </li>
          </ul>
        </div>
        <div v-if="showCompletedQuests()">
          <h4>{{ texts.completedQuests }}</h4>
          <ul>
            <li v-for="quest of completedQuests()">
              <div v-html="characterService.questStatus(quest)"></div>
            </li>
          </ul>
        </div>
      </div>
    </collapsible>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {isEmpty} from "storyScript/utilityFunctions.ts";
import {IQuest} from "storyScript/Interfaces/quest.ts";

const store = useStateStore();
const {useQuests} = storeToRefs(store);
const {texts, characterService} = store.services;

const {quests} = defineProps<{
  quests?: IQuest[]
}>();

useQuests.value = true;

const showActiveQuests = (): boolean => currentQuests().length > 0;

const showCompletedQuests = (): boolean => completedQuests().length > 0;

const currentQuests = (): IQuest[] => quests.filter(q => q.completed === false);

const completedQuests = (): IQuest[] => quests.filter(q => q.completed === true);

</script>