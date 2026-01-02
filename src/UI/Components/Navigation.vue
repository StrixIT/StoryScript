<template>
  <div class="container-fluid menu-bar">
    <div class="row">
      <div class="col-8">
        <h1>{{ texts.gameName }}</h1>
      </div>
      <div class="col-4">
        <div v-if="isDevelopment" id="location-selector">
          <input v-if="availableLocations.length > 1"
                 ref="locationSelector"
                 aria-autocomplete="list"
                 autocapitalize="off"
                 autocomplete="off"
                 class="form-control"
                 placeholder="Jump to location..."
                 type="text"
                 @focus="setShowSelection(true)"
                 @focusout="setShowSelection(false)"
                 @keyup="search"
          />
          <ul v-if="showSelection" id="location-selector-locations" :class="showSelection ? 'show' : ''"
              class="dropdown-menu">
            <li v-for="location of selectedLocations.slice(0, maxLocationsShown)"
                class="dropdown-item"
                @click="game.changeLocation(location.id)"
                @mouseenter="setActive">{{ location.name }}
            </li>
            <li v-if="selectedLocations.length > maxLocationsShown" class="dropdown-item refine-search">
              <pre>{{ `More than ${maxLocationsShown} locations found.\r\nSearch to reduce the list.` }}</pre>
            </li>
          </ul>
        </div>
        <div class="float-right">
          <button class="btn btn-dark btn-sm" type="button" @click="game.playState = PlayState.Menu">
            {{ texts.mainMenuShort }}
          </button>
          <button v-if="isDevelopment" id="resetbutton" class="btn btn-danger btn-sm" type="button"
                  @click="gameService.reset()">
            {{ texts.resetWorld }}
          </button>
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

const maxLocationsShown = 20;
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

</script>