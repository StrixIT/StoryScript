<template>
  <img v-if="!finished" ref="sprite" :data-sprite-height="spriteSettings.height" :data-sprite-width="spriteSettings.width"
       :src="`resources/${spriteSettings.sheet}`" @load="initSprite"/>
</template>
<script lang="ts" setup>
import {Sprite} from 'storyScript';
import {onUnmounted, ref, useTemplateRef, watch} from "vue";

const props = defineProps<{
  factor?: number;
  spriteSettings: Sprite;
}>();

const sprite = useTemplateRef('sprite');
const finished = ref(false);

let animation: Animation;
const animationFrames: Keyframe[] = [];
const animationSettings: KeyframeAnimationOptions = {};

watch(() => props.factor, () => {
  updateSprite();
});

onUnmounted(() => {
  cleanupAnimation();
});

const cleanupAnimation = () => {
  animation?.cancel();
  animation = null;
}

const initSprite = () => {
  animationFrames.push({objectPosition: '0 0'});
  // Todo: add additional steps here to support sprite sheets with multiple rows(?)
  animationFrames.push({objectPosition: '100% 0'});

  animationSettings.duration = (props.spriteSettings.speed ??= 1) * 1000;
  animationSettings.iterations = props.spriteSettings.iterations ?? Infinity;
  animationSettings.easing = `steps(${props.spriteSettings.steps}, jump-none)`;
  updateSprite();
}

const updateSprite = () => {
  cleanupAnimation();

  // We need a timeout to make setting up a new animation work in all cases. Without the timeout, the whole 
  // sprite sheet will be displayed without any animation on updates and hot reloads.
  setTimeout(() => {
    updateSpriteAnimation();
  });
}

const updateSpriteAnimation = () => {
  if (!sprite.value) {
    return;
  }

  const factor = props.factor ?? 1;
  sprite.value.width = Math.round(props.spriteSettings.width * factor);
  sprite.value.height = Math.round(props.spriteSettings.height * factor);
  sprite.value.style.objectFit = 'cover';
  animation = sprite.value.animate(animationFrames, animationSettings);

  if (props.spriteSettings.finishedCallBack) {
    animation.finished.then(() => {
      finished.value = true;
      props.spriteSettings.finishedCallBack();
    });
  }
}

</script>