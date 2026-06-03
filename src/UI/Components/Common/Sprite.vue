<template>
  <img ref="sprite" :src="`resources/${spriteSettings.sheet}`" @load="initSprite"/>
</template>
<script lang="ts" setup>
import {Sprite} from "storyScript/Interfaces/sprite.ts";
import {useTemplateRef} from "vue";

const props = defineProps<{
  spriteSettings: Sprite;
}>();

const animationSettings = [];
const sprite = useTemplateRef('sprite');

const initSprite = () => {
  props.spriteSettings.height ??= sprite.value.naturalHeight;
  props.spriteSettings.steps ??= sprite.value.naturalWidth / props.spriteSettings.width;
  props.spriteSettings.speed ??= 1;
  animationSettings.push({objectPosition: '0 0'});

  for (let i = 1; i < props.spriteSettings.steps - 1; i++) {
    const step = Math.round(100 / (props.spriteSettings.steps - 1) * i);
    animationSettings.push({objectPosition: `${step}% 0`});
  }

  animationSettings.push({objectPosition: '100% 0'});

  sprite.value.style.width = `${props.spriteSettings.width}px`;
  sprite.value.style.height = `${props.spriteSettings.height}px`;
  sprite.value.style.objectFit = 'cover';
  sprite.value.style.animationTimingFunction = 'jump-none';

  sprite.value.animate(animationSettings, {
    duration: props.spriteSettings.speed * 1000,
    iterations: Infinity,
    easing: `steps(${props.spriteSettings.steps}, jump-none)`
  });
}

</script>