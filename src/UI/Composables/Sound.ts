import {useStateStore} from "ui/StateStore.ts";
import {Ref, ref} from "vue";
import {storeToRefs} from "pinia";

export function useSound(musicPlayerRef: Ref<HTMLAudioElement>) {
    const store = useStateStore();
    const {game} = storeToRefs(store);
    const {rules, soundService} = store.services;

    const musicPlayer = musicPlayerRef;

    const canPlay = ref(false);
    const fadeInterval = ref<NodeJS.Timeout>(null);
    const fadingMusic = ref(false);
    const currentMusic = ref<string>(null);
    const currentVolume = ref(1);

    const soundQueue: [number, string][] = [];

    const getSoundQueue = (): [number, string][] => {
        Array.from(game.value.sounds.soundQueue).forEach(e => {
            if (!e[1].playing) {
                soundQueue.push([e[0], e[1].value]);
                e[1].playing = true;
            }
        });

        return soundQueue;
    }

    // This code is here to (re)start music playback as soon as the user interacts with the browser.
    const checkMusicPlaying = async () => {
        if (!getCurrentMusic() || canPlay.value) {
            return;
        }

        if (musicPlayer.value) {
            // This will trigger a warning when the user hasn't interacted with the web page yet. Currently (June 1st 2023),
            // I haven't found a way to silence this warning.
            const audioContext = new window.AudioContext();

            if (!audioContext) {
                return;
            }
            
            if (audioContext.state === 'running') {
                canPlay.value = true;
                return;
            }

            if (audioContext.state !== 'suspended' && musicPlayer.value.paused) {
                await musicPlayer.value.play();
                canPlay.value = true;
                return;
            }

            if (audioContext.state === 'suspended') {
                musicPlayer.value.play().then(() => {
                    musicPlayer.value.play();
                    canPlay.value = true;
                }).catch(_ => {
                    // Do nothing. Silence the error and await another try.
                });
            }
        }
    }

    const getCurrentMusic = (): string => {
        const music = soundService.getCurrentMusic();

        if (rules.setup.fadeMusicInterval) {

            if (!currentMusic.value) {
                currentMusic.value = music;
            }

            if (!fadingMusic.value && music != currentMusic.value) {
                fadingMusic.value = true;
                fadeInterval.value = setInterval(() => fade(music), rules.setup.fadeMusicInterval);
            }

            return currentMusic.value;
        }

        return music;
    }

    const soundCompleted = (soundKey: number) => {
        const sound = game.value.sounds.soundQueue.get(soundKey);
        
        if (sound) {
            sound.completeCallBack?.();
            game.value.sounds.soundQueue.delete(soundKey);
        }
        
        const queueEntry = soundQueue.find(([k, _]) => soundKey === k);
        
        if (!queueEntry) {
            return;    
        }
        
        const index = soundQueue.indexOf(queueEntry);

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

        musicPlayer.value.volume = currentVolume.value;
    }

    return {
        canPlay,
        getSoundQueue,
        checkMusicPlaying,
        getCurrentMusic,
        soundCompleted
    }
}