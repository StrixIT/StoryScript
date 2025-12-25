<template>
  <modal-dialog :canClose="true"
                :closeButton="false"
                :openState="PlayState.Menu"
                :title="texts.mainMenu">
    <div id="mainmenu">
      <button v-if="game.state !== GameState.CreateCharacter" class="btn btn-outline-dark btn-lg" type="button"
              @click="save()">{{ texts.saveGame }}
      </button>
      <button class="btn btn-outline-dark btn-lg" type="button" @click="load()">{{ texts.loadGame }}</button>
      <button class="btn btn-outline-danger btn-lg" type="button" @click="restart()">{{ texts.startOver }}</button>
    </div>

    <div v-if="menuState === 'ConfirmRestart'" id="confirmrestart">
      <h4>
        {{ texts.confirmRestart }}
      </h4>
      <button class="btn btn-outline-dark btn-lg" type="button" @click="cancel()">{{ texts.restartCancelled }}</button>
      <button class="btn btn-outline-danger btn-lg" type="button" @click="restartConfirmed()">{{
          texts.restartConfirmed
        }}
      </button>
    </div>

    <div v-if="menuState === 'Save' || menuState === 'Load'">
      <div class="row">
        <div id="save-game" class="col-12">
          <p>{{ texts.existingSaveGames }}</p>
          <ul class="list-unstyled">
            <li v-for="key of saveKeys">
              <span @click="setSelected(key)">{{ key }}</span>
            </li>
          </ul>
          <div v-if="menuState === 'Save'">
            <p>{{ texts.newSaveGame }}</p>
            <input v-model="selectedGame" class="col-md-8 question-input" type="text"/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <p v-if="menuState === 'Save' && overwriteSelected()" class="alert alert-danger">
            {{ texts.format(texts.overwriteSaveGame, [selectedGame]) }}</p>
          <p v-if="menuState === 'Load' && selectedGame" class="alert alert-success">
            {{ texts.format(texts.loadSaveGame, [selectedGame]) }}</p>
          <button v-if="menuState === 'Save'" :disabled="!selectedGame" class="btn btn-primary save-button"
                  type="button"
                  @click="saveGame()">{{ texts.save }}
          </button>
          <button v-if="menuState === 'Load'" :disabled="!selectedGame" class="btn btn-primary save-button"
                  type="button"
                  @click="loadGame()">{{ texts.load }}
          </button>
          <button class="btn btn-primary save-button" type="button" @click="cancel()">{{ texts.cancel }}</button>
        </div>
      </div>
    </div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {GameState, PlayState} from "storyScript/Interfaces/storyScript.ts";
import {computed, ref} from "vue";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, dataService, gameService} = store.services;

const internalState = ref<string>(PlayState.Menu);
const selectedGame = ref<string>(null);
const saveKeys = ref<string[]>([]);
const menuState = computed(() => game.value.playState === PlayState.Menu ? internalState.value ?? PlayState.Menu : null);

const restart = (): string => internalState.value = 'ConfirmRestart';

const setSelected = (name: string) => selectedGame.value = name;

const overwriteSelected = (): boolean => dataService.getSaveKeys().indexOf(selectedGame.value) > -1;

const cancel = (): void => {
  setSelected(null);
  internalState.value = null;
  game.value.playState = null;
}

const restartConfirmed = (): void => {
  gameService.restart();
  cancel();
}

const save = (): void => {
  saveKeys.value = dataService.getSaveKeys();
  internalState.value = 'Save';
}

const load = (): void => {
  saveKeys.value = dataService.getSaveKeys();
  internalState.value = 'Load';
}

const saveGame = (): void => {
  dataService.saveGame(game.value, selectedGame.value);
  cancel();
}

const loadGame = (): void => {
  gameService.loadGame(selectedGame.value);
  cancel();
}

</script>