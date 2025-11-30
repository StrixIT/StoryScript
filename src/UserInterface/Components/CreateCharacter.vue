<template>
  <div v-if="state === 'CreateCharacter'" class="box-container" id="create-character">
    <div class="box-title">{{ titleText() }}</div>
    <build-character :sheet="sheet"></build-character>
    <button v-if="sheet.currentStep >= sheet.steps.length - 1 || sheet.steps[sheet.currentStep].finish" type="button" id="start-adventure" class="btn btn-primary" :disabled="!distributionDone()" @click="startNewGame()">{{ startText() }}</button>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {IParty} from "storyScript/Interfaces/party.ts";
import {ICreateCharacter} from "storyScript/Interfaces/createCharacter/createCharacter.ts";
import {GameState} from "storyScript/Interfaces/enumerations/gameState.ts";
import {useServices} from "vue/Services.ts";

const store = useStateStore();
const {texts, rules} = storeToRefs(store);
const gameService = useServices().getGameService();
const characterService = useServices().getCharacterService();

const { state, party, sheet } = defineProps<{
  state: GameState;
  party?: IParty,
  sheet?: ICreateCharacter
}>();

const titleText = (): string => {
  if (rules.value.setup.numberOfCharacters > 1) {
    switch (party.characters.length || 0) {
      case 0:
        return texts.value.firstCharacter;
      case 1:
        return texts.value.secondCharacter;
      case 2:
        return texts.value.thirdCharacter;
      default:
        return texts.value.format(texts.value.nthCharacter, [(party.characters.length + 1).toString()])
    }
  }

  return texts.value.newGame;
};

const startText = (): string => {
  if (rules.value.setup.numberOfCharacters > 1 && (party.characters.length < rules.value.setup.numberOfCharacters - 1)) {
    return texts.value.nextCharacter;
  }

  return texts.value.startAdventure;
};

const distributionDone = (): boolean => characterService.distributionDone(sheet, null);

const startNewGame = () => gameService.startNewGame(sheet);

</script>