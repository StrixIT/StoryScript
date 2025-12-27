<template>
  <modal-dialog :canClose="true"
                :closeButton="true"
                :openState="PlayState.Trade"
                :title="game.trade.name">
    <div id="trade">
      <p class="trade-description">{{ game.trade.text }}</p>
      <stock :buyer="game.activeCharacter" :seller="game.trade" :stock="game.trade.buy"></stock>
      <stock :buyer="game.trade" :seller="game.activeCharacter" :stock="game.trade.sell"></stock>
      <p v-if="game.trade.currency !== undefined">
        {{ texts.format(texts.traderCurrency, [game.trade.currency.toString(), texts.currency]) }}
      </p>
    </div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts} = store.services;

</script>