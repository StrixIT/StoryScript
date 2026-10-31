<template>
  <div v-if="canPlay !== null && !canPlay" class="no-play-container alert alert-warning">
    <p>
      {{ texts.noPlayWarning }}
    </p>
  </div>
  <audio v-if="getCurrentMusic()"
         ref="music-player"
         :src="`resources/${getCurrentMusic()}`"
         autoplay
         class="storyscript-player"
         loop
         muted>
  </audio>
  <audio v-for="sound of getSoundQueue()" v-if="canPlay" :src="`resources/${sound[1]}`"
         autoplay
         class="storyscript-player"
         @ended="soundCompleted(sound[0])">
  </audio>
</template>
<script lang="ts" setup>
import {useSound, useStateStore} from 'storyScript';

const store = useStateStore();
const {texts} = store.services;

const {
  canPlay,
  getSoundQueue,
  getCurrentMusic,
  soundCompleted
} = useSound();

</script>