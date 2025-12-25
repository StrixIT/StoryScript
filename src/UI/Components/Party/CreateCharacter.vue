<template>
  <div v-if="game.state === 'CreateCharacter'" id="create-character" class="box-container">
    <div class="box-title">{{ titleText() }}</div>
    <build-character :sheet="game.createCharacterSheet"></build-character>
    <button
        v-if="game.createCharacterSheet.currentStep >= game.createCharacterSheet.steps.length - 1 || game.createCharacterSheet.steps[game.createCharacterSheet.currentStep].finish"
        id="start-adventure" :disabled="!characterService.distributionDone(game.createCharacterSheet, null)"
        class="btn btn-primary" type="button"
        @click="gameService.startNewGame(game.createCharacterSheet)">{{ startText() }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, rules, characterService, gameService} = store.services;

const titleText = (): string => {
  if (rules.setup.numberOfCharacters > 1) {
    switch (game.value.party.characters.length || 0) {
      case 0:
        return texts.firstCharacter;
      case 1:
        return texts.secondCharacter;
      case 2:
        return texts.thirdCharacter;
      default:
        return texts.format(texts.nthCharacter, [(game.value.party.characters.length + 1).toString()])
    }
  }

  return texts.newGame;
};

const startText = (): string => {
  if (rules.setup.numberOfCharacters > 1 && (game.value.party.characters.length < rules.setup.numberOfCharacters - 1)) {
    return texts.nextCharacter;
  }

  return texts.startAdventure;
};

</script>