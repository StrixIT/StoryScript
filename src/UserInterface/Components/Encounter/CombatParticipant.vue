<template>
  <h4>{{ participant.name }}</h4>
  <p :class="{ 'enemy-health': participantType === 'enemy', 'character-health': participantType === 'character' }">
    {{ texts.format(hitPointText, [participant.currentHitpoints, participant.hitpoints]) }}
  </p>
  <img v-if="participant.picture" :src="participant.picture" :alt="participant.name" />
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {computed} from "vue";

const store = useStateStore();
const {texts} = store.services;

const participantType = computed(() => participant.type ?? 'character');

const hitPointText = computed(() => participant.type ? texts.enemyHitpoints : texts.characterHitpoints);

const {participant} = defineProps<{
  participant: any
}>();

</script>