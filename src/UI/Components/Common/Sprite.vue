<template>
  <img v-if="!animationFinished" ref="sprite" :data-sprite-height="spriteSettings.height"
       :data-sprite-width="spriteSettings.width"
       :src="`resources/${spriteSettings.sheet}`" @load="initSprite"/>
</template>
<script lang="ts" setup>
import {Sprite, useSpriteAnimation} from 'storyScript';
import {useTemplateRef} from "vue";

const props = defineProps<{
  factor?: number;
  spriteSettings: Sprite;
}>();

const sprite = useTemplateRef<HTMLImageElement>('sprite');

const {initSprite, animationFinished} = useSpriteAnimation(sprite, props.spriteSettings, props.factor);

</script>