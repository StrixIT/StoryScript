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
         muted
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
import {useTemplateRef, watch} from "vue";
import {useSound} from "ui/Composables/Sound.ts";
import {useStateStore} from "ui/StateStore.ts";

const store = useStateStore();
const {texts} = store.services;
const musicPlayer = useTemplateRef('music-player');

const {
  canPlay,
  getSoundQueue,
  getCurrentMusic,
  soundCompleted
} = useSound(musicPlayer);

watch(canPlay, (newValue) => musicPlayer.value.muted = !newValue);

</script>