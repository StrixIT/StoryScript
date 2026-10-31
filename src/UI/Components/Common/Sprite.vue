<template>
  <img v-if="!animationFinished" ref="sprite" :data-sprite-height="spriteSettings.height"
       :data-sprite-width="spriteSettings.width"
       :src="`resources/${spriteSettings.sheet}`" @load="initSprite"/>
</template>
<script lang="ts" setup>
import {Sprite, useSpriteAnimation} from 'storyScript';

const props = defineProps<{
  factor?: number;
  spriteSettings: Sprite;
}>();

const {initSprite, animationFinished} = useSpriteAnimation(props.spriteSettings, props.factor);

</script>