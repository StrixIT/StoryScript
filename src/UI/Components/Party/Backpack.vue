<template>
  <div id="character-backpack" class="box-container">
    <collapsible :headerClass="'box-title'" :text="texts.backpack">
      <ul id="backpack-panel" class="list-unstyled">
        <li v-for="item of character.items">
          <div :class="game.combinations.getCombineClass(item)" @click="game.combinations.tryCombine(item)">
            <span>{{ itemService.getItemName(item) }}</span>
            <div id="backpack-button-row" class="inline">
              <button v-if="itemService.isEquippable(item, character) && store.showEquipment(character)"
                      class="btn btn-info btn-sm" type="button"
                      @click="itemService.equipItem(character, item)">{{ texts.equip }}
              </button>
              <button v-if="hasDescription(item)" class="btn btn-info btn-sm" type="button"
                      @click="store.showDescription('item', item, itemService.getItemName(item))">{{ texts.view }}
              </button>
              <button v-if="canUseItem(character, item)" class="btn btn-info btn-sm" type="button"
                      @click="itemService.useItem(character, item)">{{ texts.use }}
              </button>
              <button v-if="itemService.canGroupItem(character, joinItem, item as IGroupableItem<IItem>)"
                      :class="{ 'btn-primary': item === joinItem, 'btn-outline-secondary': joinItem && item !== joinItem, 'btn-info': !joinItem  }"
                      class="btn btn-sm"
                      type="button"
                      @click="groupItem(item as IGroupableItem<IItem>)">{{ texts.groupItem }}
              </button>
              <button v-if="(item as IGroupableItem<IItem>).members?.length > 0" class="btn btn-info btn-sm"
                      type="button" @click="itemService.splitItemGroup(character, item as IGroupableItem<IItem>)">
                {{ texts.splitItemGroup }}
              </button>
              <button v-if="useGround && itemService.canDrop(item)" class="btn btn-info btn-sm" type="button"
                      @click="itemService.dropItem(character, item)">{{ texts.drop }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </collapsible>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {storeToRefs} from "pinia";
import {IGroupableItem} from "storyScript/Interfaces/groupableItem.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ref} from "vue";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {hasDescription} from "storyScript/Services/sharedFunctions.ts";

const store = useStateStore();
const {game, useGround, useBackpack} = storeToRefs(store);
const {texts, itemService} = store.services;

const {character} = defineProps<{
  character?: ICharacter
}>();

const joinItem = ref<IGroupableItem<IItem>>(null);

useBackpack.value = true;

const canUseItem = (character: ICharacter, item: IItem): boolean =>
    item.use && (!item.canUse || item.canUse(game.value, character, item));

const groupItem = (item: IGroupableItem<IItem>): void => {
  if (joinItem.value && itemService.groupItem(character, joinItem.value, item)) {
    joinItem.value = null;
  } else {
    joinItem.value = item;
  }
}

</script>