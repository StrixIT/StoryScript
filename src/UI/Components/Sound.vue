<template>
  <audio ref="music-player"
         v-if="getCurrentMusic()"
         :src="`resources/${getCurrentMusic()}`"
         autoplay
         class="storyscript-player"
         loop>
  </audio>
  <audio v-for="sound of getSoundQueue()" :src="`resources/${sound[1]}`"
         autoplay
         class="storyscript-player"
         @ended="soundCompleted(sound[0])">
  </audio>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, useTemplateRef} from "vue";
import {useSound} from "ui/Composables/Sound.ts";

const {getSoundQueue, getCurrentMusic, checkMusicPlaying, soundCompleted} = useSound(useTemplateRef('music-player'));
let interval: NodeJS.Timeout;

onMounted(() => {
  interval = setInterval(checkMusicPlaying, 1000);
})

onUnmounted(() => {
  interval = null;
})

</script>