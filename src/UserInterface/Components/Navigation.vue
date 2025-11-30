<template>
  <div class="container-fluid menu-bar">
    <div class="row">
      <div class="col-8">
        <h1>{{ texts.gameName }}</h1>
      </div>
      <div class="col-4">
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
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {isDevelopment} from "vue/Helpers.ts";
import {useServices} from "vue/Services.ts";

const store = useStateStore();
const {game, texts} = storeToRefs(store);
const gameService = useServices().getGameService();

const menu = () => {
  game.value.playState = PlayState.Menu;
}

const reset = () => gameService.reset();

</script>