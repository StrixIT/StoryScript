<template>
  <div v-if="stock">{{ stock.text }}</div>
  <p v-if="stock.items?.length === 0" class="trade-empty">{{ stock.emptyText }}</p>
  <ul v-if="stock.items?.length > 0 && !confirm" class="list-unstyled">
    <li v-for="item of stock.items" class="inline">
      <button :disabled="!tradeService.canPay(item, buyer, seller)"
              class="btn btn-success"
              type="button"
              @click="buyOrSell(item)">
        {{ tradeService.displayPrice(item, tradeService.actualPrice(item, buyer, seller)) }}
      </button>
    </li>
  </ul>

  <div v-if="confirm">
    <p v-html="texts.format(stock.confirmationText, [confirm.name, tradeService.actualPrice(confirm, buyer, seller).toString(), texts.currency])"></p>
    <ul class="list-unstyled">
      <li class="inline">
        <button class="btn btn-primary" type="button" @click="cancel()">{{ texts.cancelBuy }}</button>
        <button class="btn btn-warning" type="button" @click="buyOrSell(confirm)">
          {{ texts.confirmBuy }}
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IStock} from "storyScript/Interfaces/stock.ts";
import {ref} from "vue";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ITrade} from "storyScript/Interfaces/trade.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, tradeService} = store.services;

const {stock, buyer, seller} = defineProps<{
  buyer: ITrade | ICharacter,
  seller: ITrade | ICharacter,
  stock: IStock
}>();

const confirm = ref<IItem>(null);

const cancel = (): void => confirm.value = null;

const buyOrSell = (item: IItem): boolean => {
  const actualPrice = tradeService.actualPrice(item, buyer, seller);

  if (actualPrice > 0 && !confirm.value) {
    confirm.value = item;
    return true;
  }

  confirm.value = null;
  return buyer === game.value.activeCharacter ? tradeService.buy(item, seller) : tradeService.sell(item, buyer);
}

</script>