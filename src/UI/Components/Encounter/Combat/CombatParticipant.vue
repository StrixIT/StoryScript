<template>
  <div ref="participant-container" class="combat-participant-container">
    <h4>{{ participant.name }}</h4>
    <p :class="healthClass">
      {{ texts.format(hitPointText, [participant.currentHitpoints?.toString(), participant.hitpoints.toString()]) }}
    </p>
    <img v-if="participant.picture" ref="participant-image" :alt="participant.name" :src="participant.picture"
         class="combat-participant">
    <sprite v-if="animationVisible" :spriteSettings="participant.displayAnimation"
            :style="animationStyle" alt="Under attack!"></sprite>
  </div>
</template>
<script lang="ts" setup>
import {ICombatParticipant, useDisplayAnimation, useStateStore} from 'storyScript';
import {useTemplateRef} from "vue";

const store = useStateStore();
const {texts} = store.services;

const {participant} = defineProps<{
  participant: ICombatParticipant;
}>();

const participantContainerRef = useTemplateRef('participant-container');
const participantImageRef = useTemplateRef('participant-image');

const {
  healthClass,
  hitPointText,
  animationVisible,
  animationStyle
} = useDisplayAnimation(participant, participantContainerRef, participantImageRef);

</script>