<template>
  <div class="container-fluid menu-bar">
    <div class="row">
      <div class="col-8">
        <h1>{{ texts.gameName }}</h1>
      </div>
      <div class="col-4">
        <input id="location-selector" 
               v-if="availableLocations.length > 1" 
               type="text" 
               autocapitalize="off"
               autocomplete="off"
               aria-autocomplete="list"
               class="form-control"
               placeholder="Jump to location..."
               ref="locationSelector"
               @keyup="search"
               @focus="setShowSelection(true)"
               @focusout="setShowSelection(false)"
        />
        <ul v-if="showSelection" id="location-selector-locations" class="dropdown-menu" :class="showSelection ? 'show' : ''">
          <li v-for="location of selectedLocations.slice(0, maxLocationsShown)" 
              class="dropdown-item"
              @mouseenter="setActive"
              @click="jumpToLocation(location.id)">{{ location.name }}</li>
          <li v-if="selectedLocations.length > maxLocationsShown" class="dropdown-item refine-search"><pre>{{ `More than ${maxLocationsShown} locations\r\nfound.Search to reduce the\r\nsize of the list.` }}</pre></li>
        </ul>
        <div class="float-right">
          <button type="button" class="btn btn-dark btn-sm" @click="menu()">{{ texts.mainMenuShort }}</button>
          <button v-if="isDevelopment" id="resetbutton" type="button" class="btn btn-danger btn-sm" @click="reset()">{{ texts.resetWorld }}</button>
        </div>
        <div class="float-none"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {isDevelopment} from "../../../constants.ts";
import {ref, useTemplateRef} from "vue";

const maxLocationsShown = 25;
const store = useStateStore();
const {game, availableLocations} = storeToRefs(store);
const {texts, gameService} = store.services;

const locationSelector = useTemplateRef('locationSelector');
const selectedLocations = ref(availableLocations.value);
const showSelection = ref(false);

const setActive = (event: MouseEvent) => {
  const element = event.currentTarget as HTMLElement;
  const allElements = element.parentElement.children;
  
  for (const el of allElements) {
    el.classList.remove("active");
  }
  
  if (element.classList.contains('active')) {
    element.classList.remove('active');
  } else {
   element.classList.add('active'); 
  }
}

const setShowSelection = (value: boolean) => {
  if (value === false) {
    // When losing focus, set a timeout to allow the click handler to fire!
    setTimeout(() => {
      showSelection.value = value;
    }, 100)
  } else {
    showSelection.value = value; 
  }
}

const search = () => {
  const searchString = locationSelector.value.value.toLowerCase();
  selectedLocations.value = availableLocations.value.filter(l => l.name.toLocaleLowerCase().includes(searchString));
}

const jumpToLocation = (id: string) => {
  game.value.changeLocation(id);
}

const menu = () => game.value.playState = PlayState.Menu;

const reset = () => gameService.reset();

</script>