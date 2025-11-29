<template>
  <audio v-if="getCurrentMusic()" :src="`resources/${getCurrentMusic()}`"
         autoplay class="storyscript-player backgroundmusic-player" loop></audio>
  <audio v-for="sound of getSoundQueue()" autoplay class="storyscript-player" src="resources/{{ sound[1] }}"
         @ended="soundCompleted(sound[0])"></audio>
</template>
<script lang="ts" setup>
import {useStateStore} from "vue/StateStore.ts";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import {ISoundPlayer} from "storyScript/Interfaces/soundPlayer.ts";

const store = useStateStore();
const {rules} = storeToRefs(store);

const isPlaying = ref(false);
const fadeInterval = ref<NodeJS.Timeout>(null);
const fadingMusic = ref(false);
const currentMusic = ref<string>(null);
const currentVolume = ref(1);
const soundQueue: [number, string][] = [];

const {sounds, rootElement} = defineProps<{
  sounds?: ISoundPlayer,
  rootElement?: HTMLElement,
}>();

// This code is here to (re)start music playback as soon as the user interacts with the browser.
const checkMusicPlaying = () => {
  if (isPlaying) {
    return;
  }

  const backgroundMusicElement = getMusicPlayer();

  if (backgroundMusicElement) {
    // This will trigger a warning when the user hasn't interacted with the web page yet. Currently (June 1st 2023),
    // I haven't found a way to silence this warning.
    const audioContext = new window.AudioContext();

    if (audioContext?.state !== 'suspended') {
      backgroundMusicElement.play();
      isPlaying.value = true;
    }
  }
}

setInterval(checkMusicPlaying, 500);

const getCurrentMusic = (): string => {
  const music = store.getSoundService().getCurrentMusic();

  if (rules.value.setup.fadeMusicInterval) {

    if (!currentMusic) {
      currentMusic.value = music;
    }

    if (!fadingMusic && music != currentMusic.value) {
      fadingMusic.value = true;
      fadeInterval.value = setInterval(() => fade(music), rules.value.setup.fadeMusicInterval);
    }

    return currentMusic.value;
  }

  return music;
}

const getSoundQueue = (): [number, string][] => {
  Array.from(sounds.soundQueue).forEach(e => {
    if (!e[1].playing) {
      soundQueue.push([e[0], e[1].value]);
      e[1].playing = true;
    }
  });

  return soundQueue;
}

const soundCompleted = (soundKey: number) => {
  sounds.soundQueue.get(soundKey).completeCallBack?.();
  sounds.soundQueue.delete(soundKey);
  const index = soundQueue.indexOf(soundQueue.find(([k, _]) => soundKey === k));

  if (index > -1) {
    soundQueue.splice(index, 1);
  }
}

const fade = (newMusic: string) => {
  const newVolume = currentVolume.value - 0.1;

  if (newVolume >= 0) {
    currentVolume.value = newVolume;
  } else {
    clearInterval(fadeInterval.value);
    currentVolume.value = 1;
    currentMusic.value = newMusic;
    fadingMusic.value = false;
  }

  const backgroundMusicElement = getMusicPlayer();
  backgroundMusicElement.volume = currentVolume.value;
}

const getMusicPlayer = () => {
  return <HTMLAudioElement>rootElement.getElementsByClassName('backgroundmusic-player')[0];
}

</script>