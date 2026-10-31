<template>
  <div ref="participant-container" class="combat-participant-container">
    <h4>{{ participant.name }}</h4>
    <p :class="healthClass">
      {{ texts.format(hitPointText, [participant.currentHitpoints, participant.hitpoints]) }}
    </p>
    <img v-if="participant.picture" ref="participant-image" :alt="participant.name" :src="participant.picture"
         class="combat-participant">
    <sprite v-if="attackAnimationVisible" :spriteSettings="participant.displayAttackAnimation"
            :style="attackAnimationStyle" alt="Under attack!"></sprite>
  </div>
</template>
<script lang="ts" setup>
import {useAttackAnimation, useStateStore} from 'storyScript';

const store = useStateStore();
const {texts} = store.services;

const {participant} = defineProps<{
  participant: any
}>();

const {healthClass, hitPointText, attackAnimationVisible, attackAnimationStyle} = useAttackAnimation(participant);

</script>