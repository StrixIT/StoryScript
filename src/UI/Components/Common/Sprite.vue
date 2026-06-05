<template>
  <img ref="sprite" :src="`resources/${spriteSettings.sheet}`" @load="initSprite"/>
</template>
<script lang="ts" setup>
import {Sprite} from "storyScript/Interfaces/sprite.ts";
import {useTemplateRef, watch} from "vue";

const props = defineProps<{
  factor: number;
  spriteSettings: Sprite;
}>();

const sprite = useTemplateRef('sprite');

let animation: Animation;
const animationFrames: Keyframe[] = [];
const animationSettings: KeyframeAnimationOptions = {};

watch(() => props.factor, () => {
  updateSprite();
});

const initSprite = () => {
  animationFrames.push({objectPosition: '0 0'});
  // Todo: add additional steps here to support sprite sheets with multiple rows(?)
  animationFrames.push({objectPosition: '100% 0'});

  animationSettings.duration = (props.spriteSettings.speed ??= 1) * 1000;
  animationSettings.iterations = Infinity;
  animationSettings.easing = `steps(${props.spriteSettings.steps}, jump-none)`;
  updateSprite();
}

const updateSprite = () => {
  animation?.cancel();
  animation = null;

  // We need a timeout to make setting up a new animation work in all cases. Without the timeout, the whole 
  // sprite sheet will be displayed without any animation on updates and hot reloads.
  setTimeout(() => {
    updateSpriteAnimation();
  });
}

const updateSpriteAnimation = () => {
  sprite.value.width = Math.round(props.spriteSettings.width * props.factor);
  sprite.value.height = Math.round(props.spriteSettings.height * props.factor);
  sprite.value.style.objectFit = 'cover';
  animation = sprite.value.animate(animationFrames, animationSettings);
}

</script>