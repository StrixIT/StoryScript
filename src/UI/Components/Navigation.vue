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
               @focus="setShowSelection(true)"
               @focusout="setShowSelection(false)"
        />
        <ul v-if="showSelection" id="location-selector-locations" class="dropdown-menu" :class="showSelection ? 'show' : ''">
          <li v-for="location of selectedLocations" 
              class="dropdown-item"
              @mouseenter="setActive"
              @keyup="search" 
              @click="jumpToLocation(location.id)">{{ location.name }}</li>
        </ul>
<!--        @if (isDevelopment && locations.length > 1)-->
<!--        {-->
<!--        <input-->
<!--            id="location-selector"-->
<!--            type="text"-->
<!--            class="form-control"-->
<!--            [(ngModel)]="model"-->
<!--            [ngbTypeahead]="search"-->
<!--            [inputFormatter]="formatter"-->
<!--            [resultFormatter]="formatter"-->
<!--            [editable]="false"-->
<!--            placeholder="Jump to location..."-->
<!--            (focus)="focus$.next($any($event).target.value)"-->
<!--            (click)="click$.next($any($event).target.value)"-->
<!--            (selectItem)="jumpToLocation($event)"-->
<!--            #instance="ngbTypeahead"-->
<!--        />-->
<!--        }-->
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
import {computed, ref, useTemplateRef} from "vue";

const store = useStateStore();
const {game, availableLocations} = storeToRefs(store);
const {texts, gameService} = store.services;

const locationSelector = useTemplateRef('locationSelector');
const selectedLocations = ref(availableLocations.value.slice(0, 25));
const showSelection = ref(false);

const setActive = (event: MouseEvent) => {
  const element = event.currentTarget as HTMLElement;
  
  if (element.classList.contains('active')) {
    element.classList.remove('active');
  } else {
   element.classList.add('active'); 
  }
}

const setShowSelection = (value: boolean) => {
  if (value === false) {
    setTimeout(() => {
      showSelection.value = value;
    }, 100)
  } else {
    showSelection.value = value; 
  }
}

const search = () => {
  const searchString = locationSelector.value.value.toLowerCase();
  selectedLocations.value = availableLocations.value.filter(l => l.name.toLocaleLowerCase().includes(searchString)).slice(0, 25);
}

const jumpToLocation = (id: string) => {
  game.value.changeLocation(id);
}

const menu = () => game.value.playState = PlayState.Menu;

const reset = () => gameService.reset();

</script>