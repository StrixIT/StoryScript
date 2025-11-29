<template>
  <h4>{{ participant.name }}</h4>
  <p :class="{ 'enemy-health': participantType === 'enemy', 'character-health': participantType === 'character' }">
    {{ texts.format(hitpointText, [participant.currentHitpoints, participant.hitpoints]) }}
  </p>
  <img v-if="participant.picture" :src="participant.picture" :alt="participant.name" />
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const store = useStateStore();
const {texts} = storeToRefs(store);

const participantType = computed(() => participant.type ?? 'character');

const hitpointText = computed(() => participant.type ? texts.value.enemyHitpoints : texts.value.characterHitpoints);

const {participant} = defineProps<{
  participant: any
}>();

</script>