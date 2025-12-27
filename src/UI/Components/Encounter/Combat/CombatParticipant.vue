<template>
  <h4>{{ participant.name }}</h4>
  <p :class="healthClass">
    {{ texts.format(hitPointText, [participant.currentHitpoints, participant.hitpoints]) }}
  </p>
  <img v-if="participant.picture" :alt="participant.name" :src="participant.picture" class="combat-participant">
</template>
<script lang="ts" setup>
import {useStateStore} from "ui/StateStore.ts";
import {computed} from "vue";

const store = useStateStore();
const {texts} = store.services;

const healthClass = computed(() => participant.type ? 'enemy-health' : 'character-health');
const hitPointText = computed(() => participant.type ? texts.enemyHitpoints : texts.characterHitpoints);

const {participant} = defineProps<{
  participant: any
}>();

</script>