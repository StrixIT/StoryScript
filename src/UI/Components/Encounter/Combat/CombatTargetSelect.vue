<template>
  <div v-if="turn.item && turn.character.currentHitpoints > 0">
    <div :class="{ 'not-applicable': !turn.item.targetType }">
      <span>{{ turn.item.targetType === 'Enemy' ? texts.attack : texts.aid }}</span>
      <select v-if="filteredTargets(turn).length > 1" v-model="turn.target" class="custom-select">
        <option v-for="target of filteredTargets(turn)" :value="target">{{ (target as any).name }}</option>
      </select>
      <input v-if="filteredTargets(turn).length === 1"
             :disabled="true" :value="turn.target?.name"
             class="single-item"
             type="text"/>
    </div>
    <div v-if="turn.itemsAvailable.length">
                <span>{{
                    turn.item.targetType === 'Enemy' ? texts.attackWith : turn.item.targetType ? texts.aidWith : texts.useCombatItem
                  }}</span>
      <select v-if="turn.itemsAvailable.length > 1" v-model="turn.item" class="custom-select"
              @change="itemChange(turn.item, turn)">
        <option v-for="item of turn.itemsAvailable"
                :class="{'unselectable': !combatService.isSelectable(item)}"
                :disabled="!combatService.isSelectable(item)"
                :value="item">{{ itemService.getItemName(item) }}
        </option>
      </select>
      <input v-if="turn.itemsAvailable.length === 1" :disabled="true"
             :value="itemService.getItemName(turn.item)"
             class="single-item"
             type="text"/>
    </div>
  </div>
  <div v-if="!turn.item && turn.character.currentHitpoints > 0">
    <span>{{ setup.noActionText }}</span>
  </div>
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {ICombatSetup} from "storyScript/Interfaces/combatSetup.ts";

const store = useStateStore();
const {texts, combatService, itemService} = store.services;

const {setup, turn} = defineProps<{
  setup: ICombatSetup<ICombatTurn>,
  turn: ICombatTurn
}>();

const itemChange = (item: IItem, turn: ICombatTurn) => {
  const currentTarget = turn.target;
  const targets = filteredTargets(turn, item);
  turn.target = targets.filter(t => t === currentTarget)[0] ?? targets[0];
}

const filteredTargets = (turn: ICombatTurn, item?: IItem): (IEnemy | ICharacter)[] =>
    turn.targetsAvailable.concat([turn.character]).filter(t => combatService.canTarget(item ?? turn.item, t, turn.character));

</script>