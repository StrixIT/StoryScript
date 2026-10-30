<template>
  <div class="combat-participant-container" ref="participant-container">
    <h4>{{ participant.name }}</h4>
    <p :class="healthClass">
      {{ texts.format(hitPointText, [participant.currentHitpoints, participant.hitpoints]) }}
    </p>
    <img v-if="participant.picture" :alt="participant.name" :src="participant.picture" class="combat-participant" ref="participant-image">
    <sprite v-if="participant.displayAttackAnimation" :spriteSettings="participant.displayAttackAnimation"
            alt="Under attack!" :style="attackAnimationStyle"></sprite>
  </div>
</template>
<script lang="ts" setup>
import {Sprite as SpriteClass, useStateStore} from 'storyScript';
import {computed, useTemplateRef} from "vue";

const store = useStateStore();
const {texts} = store.services;

const healthClass = computed(() => participant.type ? 'enemy-health' : 'character-health');
const hitPointText = computed(() => participant.type ? texts.enemyHitpoints : texts.characterHitpoints);

const {participant} = defineProps<{
  participant: any
}>();

const participantContainerRef = useTemplateRef('participant-container');
const participantImageRef = useTemplateRef('participant-image');

const attackAnimationStyle = computed(() => {
  const animation = participant.displayAttackAnimation as SpriteClass;
  
  if (!participantContainerRef.value || !animation) {
    return {};
  }
  
  const containerHeight = participantContainerRef.value.clientHeight;
  const containerWidth = participantContainerRef.value.clientWidth;
  let offsetBottom: number;

  if (participantImageRef.value) {
    offsetBottom = participantImageRef.value.clientHeight / 2 - animation.height / 2;
  } else {
    offsetBottom = containerHeight / 2 - animation.height / 2;
  }
  
  const offsetLeft = containerWidth / 2 - animation.width / 2;
  
  return {
    position: 'absolute',
    bottom: `${offsetBottom}px`,
    left: `${offsetLeft}px`
  };
});

</script>