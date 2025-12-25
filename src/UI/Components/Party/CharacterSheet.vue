<template>
  <div id="character-attributes" class="box-container">
    <collapsible :headerClass="'box-title'" :text="character.name || texts.characterSheet">
      <div class="character-info">
        <div v-if="character.portraitFileName" class="portraitFrame">
          <img :alt="character.name" :src="character.portraitFileName" class="portrait"/>
        </div>
        <ul id="attributes-panel" class="list-unstyled">
          <li v-for="attribute of characterService.getSheetAttributes()">
            {{ texts.titleCase(attribute) }} {{ character[attribute] }}
          </li>
          <li>{{ texts.hitpoints }}
            <div class="hitpoint-editor">
              <span v-if="!isDevelopment">{{ character.currentHitpoints }}</span>
              <input v-else 
                     v-model="character.currentHitpoints" 
                     :max="character.hitpoints" 
                     :min="1" 
                     type="number"
                     @blur="limitInput($event, character)">
            </div>
            &nbsp;/ {{ character.hitpoints }}
          </li>
          <li v-if="party.characters.length === 1 && party.currency !== undefined">{{ texts.currency }}
            {{ party.currency }}
          </li>
        </ul>
        <div class="clearfix"></div>
      </div>
    </collapsible>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IParty} from "storyScript/Interfaces/party.ts";
import {isDevelopment} from "../../../../constants.ts";

const store = useStateStore();
const {useCharacterSheet} = storeToRefs(store);
const {texts, characterService} = store.services;

const {character} = defineProps<{
  party: IParty,
  character?: ICharacter
}>();

useCharacterSheet.value = true;

const limitInput = (_: Event, character: ICharacter): void => {
  if (character.currentHitpoints > character.hitpoints) {
    character.currentHitpoints = character.hitpoints;
  } else if (character.currentHitpoints <= 0) {
    character.currentHitpoints = 1;
  }
}

</script>