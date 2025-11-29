<template>
  <div id="character-attributes" class="box-container">
    <div class="box-title" @click="isCollapsed = !isCollapsed">{{ character.name || texts.characterSheet }}</div>
    <!-- TODO   [ngbCollapse]="isCollapsed"-->
    <div class="collapse navbar-collapse list-unstyled character-info">
      <div v-if="character.portraitFileName" class="portraitFrame">
        <img :alt="character.name" class="portrait" :src="character.portraitFileName"/>
      </div>
      <ul id="attributes-panel" class="list-unstyled">
        <li v-for="attribute of displayCharacterAttributes">
          {{ texts.titleCase(attribute) }} {{ character[attribute] }}
        </li>
        <li>{{ texts.hitpoints }}
          <div class="hitpoint-editor">
            <span v-if="!isDevelopment">{{ character.currentHitpoints }}</span>
            <input v-else v-model="character.currentHitpoints" :max="character.hitpoints" :min="1" type="number"
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
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {ref} from "vue";
import {IParty} from "storyScript/Interfaces/party.ts";
import {isDevelopment} from "vue/Helpers.ts";

const store = useStateStore();
const {texts, useCharacterSheet} = storeToRefs(store);

const {character} = defineProps<{
  party: IParty,
  character?: ICharacter
}>();

useCharacterSheet.value = true;

const isCollapsed = ref(false);
const displayCharacterAttributes = ref<string[]>([]);

const limitInput = (event: any, character: ICharacter): void => {
  if (character.currentHitpoints > character.hitpoints) {
    character.currentHitpoints = character.hitpoints;
  } else if (character.currentHitpoints <= 0) {
    character.currentHitpoints = 1;
  }
}

</script>