<template>
  <div v-if="canPlay !== null && !canPlay" class="no-play-container">
    <p>
      {{ texts.noPlayWarning }}
    </p>
  </div>
  <audio v-if="getCurrentMusic()"
         ref="music-player"
         :src="`resources/${getCurrentMusic()}`"
         autoplay
         class="storyscript-player"
         loop>
  </audio>
  <audio v-for="sound of getSoundQueue()" v-if="canPlay" :src="`resources/${sound[1]}`"
         autoplay
         class="storyscript-player"
         @ended="soundCompleted(sound[0])">
  </audio>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, useTemplateRef} from "vue";
import {useSound} from "ui/Composables/Sound.ts";
import {useStateStore} from "ui/StateStore.ts";

const store = useStateStore();
const {texts} = store.services;

const {
  canPlay,
  getSoundQueue,
  getCurrentMusic,
  checkMusicPlaying,
  soundCompleted
} = useSound(useTemplateRef('music-player'));
let interval: NodeJS.Timeout;

onMounted(() => {
  interval = setInterval(() => {
    if (!canPlay.value) {
      checkMusicPlaying();
    } else {
      clearInterval(interval);
    }
  }, 1000);
})

onUnmounted(() => {
  clearInterval(interval);
})

</script>

<style>
.no-play-container {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.no-play-container p {
  margin: 0 0 10px 0;
}
</style>