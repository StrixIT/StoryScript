<template>
  <div class="box-container" id="character-backpack">
    <div class="box-title" @click="isCollapsed = !isCollapsed">{{ texts.backpack }}</div>
<!-- TODO    [ngbCollapse]="isCollapsed"-->
    <ul id="backpack-panel" class="collapse navbar-collapse list-unstyled">
      <li v-for="item of character.items">
        <div @click="tryCombine(game, item)" :class="game.combinations.getCombineClass(item)">
          <span>{{ getItemName(item) }}</span>
          <div id="backpack-button-row" class="inline">
            <button v-if="canEquip(item) && showEquipment(character)" type="button" class="btn btn-info btn-sm" @click="equipItem(item)">{{ texts.equip }}</button>
            <button v-if="hasDescription(item)" type="button" class="btn btn-info btn-sm" @click="showDescription(game, 'item', item, getItemName(item))">{{ texts.view }}</button>
            <button v-if="canUseItem(game, character, item)" type="button" class="btn btn-info btn-sm" @click="useItem(item)">{{ texts.use }}</button>
            <button v-if="canGroupItem(item as IGroupableItem<IItem>)" type="button" class="btn btn-sm"
                    :class="{ 'btn-primary': item === joinItem, 'btn-outline-secondary': joinItem && item !== joinItem, 'btn-info': !joinItem  }"
                    @click="groupItem(item as IGroupableItem<IItem>)">{{ texts.groupItem }}
            </button>
            <button v-if="(item as IGroupableItem<IItem>).members?.length > 0" type="button" class="btn btn-info btn-sm" @click="splitItemGroup(item as IGroupableItem<IItem>)">{{ texts.splitItemGroup }}</button>
            <button v-if="useGround && canDrop(item)" type="button" class="btn btn-info btn-sm" @click="dropItem(item)">{{ texts.drop }}</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {IGroupableItem} from "storyScript/Interfaces/groupableItem.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ref} from "vue";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {canUseItem, showDescription, showEquipment, tryCombine} from "vue/Helpers.ts";
import {hasDescription} from "storyScript/Services/sharedFunctions.ts";

const store = useStateStore();
const {game, texts, useGround, useBackpack} = storeToRefs(store);
const itemService = store.getItemService();

const { character } = defineProps<{
  character?: ICharacter
}>();

const isCollapsed = ref(false);
const joinItem = ref<IGroupableItem<IItem>>(null);

useBackpack.value = true;

const getItemName = (item: IItem): string => itemService.getItemName(item);

const canEquip = (item: IItem): boolean => itemService.isEquippable(item, character);

const canDrop = (item: IItem): boolean => itemService.canDrop(item);

const equipItem = (item: IItem): boolean => itemService.equipItem(character, item);

const useItem = (item: IItem): Promise<void> | void => itemService.useItem(character, item);

const dropItem = (item: IItem): void => itemService.dropItem(character, item);

const canGroupItem = (item: IGroupableItem<IItem>): boolean => itemService.canGroupItem(character, joinItem.value, item)

const groupItem = (item: IGroupableItem<IItem>): void => {
  if (joinItem && itemService.groupItem(character, joinItem.value, item)) {
    joinItem.value = null;
  } else {
    joinItem.value = item;
  }
}

const splitItemGroup = (item: IGroupableItem<IItem>): void => itemService.splitItemGroup(character, item);

</script>