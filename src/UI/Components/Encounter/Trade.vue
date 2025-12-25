<template>
  <modal-dialog :canClose="true"
                :closeButton="true"
                :openState="PlayState.Trade"
                :title="game.trade.name">
    <div id="trade">
      <p class="trade-description">{{ game.trade.text }}</p>
      <div v-if="game.trade.buy">{{ game.trade.buy.text }}</div>
      <p v-if="game.trade.buy.items?.length === 0" class="trade-empty">{{ game.trade.buy.emptyText }}</p>
      <ul v-if="game.trade.buy.items?.length > 0 && !confirmBuyItem" class="list-unstyled">
        <li v-for="item of game.trade.buy.items" class="inline">
          <button :disabled="!tradeService.canPay(item, game.activeCharacter, game.trade)" class="btn btn-success" type="button"
                  @click="buy(item, game.activeCharacter, game.trade)">{{
              tradeService.displayPrice(item, tradeService.actualPrice(item, game.activeCharacter, game.trade))
            }}
          </button>
        </li>
      </ul>

      <div v-if="confirmBuyItem">
        <p v-html="texts.format(game.trade.buy.confirmationText, [confirmBuyItem.name, tradeService.actualPrice(confirmBuyItem, game.activeCharacter, game.trade).toString(), texts.currency])"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button class="btn btn-primary" type="button" @click="cancelBuy()">{{ texts.cancelBuy }}</button>
            <button class="btn btn-warning" type="button"
                    @click="buy(confirmBuyItem, game.activeCharacter, game.trade)">
              {{ texts.confirmBuy }}
            </button>
          </li>
        </ul>
      </div>

      <div v-if="game.trade.sell">{{ game.trade.sell.text }}</div>

      <p v-if="game.trade.sell.items?.length === 0" class="trade-empty">{{ game.trade.sell.emptyText }}</p>

      <ul v-if="game.trade.sell.items?.length > 0 && !confirmSellItem" class="list-unstyled">
        <li v-for="item of game.trade.sell.items" class="inline">
          <button :disabled="!tradeService.canPay(item, game.trade, game.activeCharacter)" class="btn btn-warning" type="button"
                  @click="sell(item, game.trade, game.activeCharacter)">{{
              tradeService.displayPrice(item, tradeService.actualPrice(item, game.trade, game.activeCharacter))
            }}
          </button>
        </li>
      </ul>

      <div v-if="confirmSellItem">
        <p v-html="texts.format(game.trade.sell.confirmationText, [confirmSellItem.name, tradeService.actualPrice(confirmSellItem, game.trade, game.activeCharacter).toString(), texts.currency])"></p>
        <ul class="list-unstyled">
          <li class="inline">
            <button class="btn btn-primary" type="button" @click="cancelSell()">{{ texts.cancelSell }}</button>
            <button class="btn btn-warning" type="button"
                    @click="sell(confirmSellItem, game.trade, game.activeCharacter)">
              {{ texts.confirmSell }}
            </button>
          </li>
        </ul>
      </div>

      <p v-if="game.trade.currency !== undefined">
        {{ texts.format(texts.traderCurrency, [game.trade.currency.toString(), texts.currency]) }}</p>
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
import {storeToRefs} from "pinia";

const store = useStateStore();
const {game} = storeToRefs(store);
const {texts, tradeService} = store.services;

const confirmBuyItem = ref<IItem>(null);
const confirmSellItem = ref<IItem>(null);

const cancelBuy = (): void => confirmBuyItem.value = null;

const buy = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => {
  if (tradeService.actualPrice(item, buyer, seller) > 0 && !confirmBuyItem.value) {
    confirmBuyItem.value = item;
    return true;
  }

  confirmBuyItem.value = null;
  return tradeService.buy(item, seller);
}

const cancelSell = (): void => confirmSellItem.value = null;

const sell = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => {
  if (tradeService.actualPrice(item, buyer, seller) > 0 && !confirmSellItem.value) {
    confirmSellItem.value = item;
    return true;
  }

  confirmSellItem.value = null;
  return tradeService.sell(item, buyer);
}

</script>