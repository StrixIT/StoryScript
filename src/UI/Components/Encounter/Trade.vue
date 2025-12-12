<template>
  <modal-dialog :close-text="texts.closeModal"
                :closeButton="true"
                :open-state="PlayState.Trade"
                :playState="playState"
                :title="trade.name">
    <div id="trade">
      <p class="trade-description">{{ trade.text }}</p>
      <div v-if="trade.buy">{{ trade.buy.text }}</div>
      <p v-if="trade.buy.items?.length === 0" class="trade-empty">{{ trade.buy.emptyText }}</p>
      <ul v-if="trade.buy.items?.length > 0 && !confirmBuyItem" class="list-unstyled">
        <li v-for="item of trade.buy.items" class="inline">
          <button :disabled="!canPay(item, character, trade)" class="btn btn-success" type="button"
                  @click="buy(item, character, trade)">{{
              displayPrice(item, actualPrice(item, character, trade))
            }}
          </button>
        </li>
      </ul>

      <div v-if="confirmBuyItem">
        <p v-html="texts.format(trade.buy.confirmationText, [confirmBuyItem.name, actualPrice(confirmBuyItem, character, trade).toString(), texts.currency])"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button class="btn btn-primary" type="button" @click="cancelBuy()">{{ texts.cancelBuy }}</button>
            <button class="btn btn-warning" type="button" @click="buy(confirmBuyItem, character, trade)">
              {{ texts.confirmBuy }}
            </button>
          </li>
        </ul>
      </div>

      <div v-if="trade.sell">{{ trade.sell.text }}</div>

      <p v-if="trade.sell.items?.length === 0" class="trade-empty">{{ trade.sell.emptyText }}</p>


      <ul v-if="trade.sell.items?.length > 0 && !confirmSellItem" class="list-unstyled">
        <li v-for="item of trade.sell.items" class="inline">
          <button :disabled="!canPay(item, trade, character)" class="btn btn-warning" type="button"
                  @click="sell(item, trade, character)">{{
              displayPrice(item, actualPrice(item, trade, character))
            }}
          </button>
        </li>
      </ul>

      <div v-if="confirmSellItem">
        <p v-html="texts.format(trade.sell.confirmationText, [confirmSellItem.name, actualPrice(confirmSellItem, trade, character).toString(), texts.currency])"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button class="btn btn-primary" type="button" @click="cancelSell()">{{ texts.cancelSell }}</button>
            <button class="btn btn-warning" type="button" @click="sell(confirmSellItem, trade, character)">
              {{ texts.confirmSell }}
            </button>
          </li>
        </ul>
      </div>

      <p v-if="trade.currency != undefined">
        {{ texts.format(texts.traderCurrency, [trade.currency.toString(), texts.currency]) }}</p>
    </div>
  </modal-dialog>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ITrade} from "storyScript/Interfaces/trade.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {ref} from "vue";

const store = useStateStore();
const {texts, tradeService} = store.services;

const {playState, trade, character} = defineProps<{
  trade?: ITrade,
  playState?: PlayState,
  character?: ICharacter
}>();

const confirmBuyItem = ref<IItem>(null);
const confirmSellItem = ref<IItem>(null);

const canPay = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => tradeService.canPay(item, buyer, seller);

const actualPrice = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): number => tradeService.actualPrice(item, buyer, seller);

const displayPrice = (item: IItem, actualPrice: number): string => tradeService.displayPrice(item, actualPrice);

const cancelBuy = (): void => confirmBuyItem.value = undefined;

const buy = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => {
  if (actualPrice(item, buyer, seller) > 0 && !confirmBuyItem) {
    confirmBuyItem.value = item;
    return true;
  }

  confirmBuyItem.value = undefined;
  return tradeService.buy(item, seller);
}

const cancelSell = (): void => confirmSellItem.value = undefined;

const sell = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => {
  if (actualPrice(item, buyer, seller) > 0 && !confirmSellItem) {
    confirmSellItem.value = item;
    return true;
  }

  confirmSellItem.value = undefined;
  return tradeService.sell(item, buyer);
}

</script>