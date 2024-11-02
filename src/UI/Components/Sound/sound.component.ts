import {Component, inject} from '@angular/core';
import {IGame} from 'storyScript/Interfaces/game';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {getTemplate} from '../../helpers';
import {IRules} from 'storyScript/Interfaces/storyScript';
import {SoundService} from "storyScript/Services/SoundService.ts";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    selector: 'sound',
    imports: [CommonModule],
    template: getTemplate('sound', await import('./sound.component.html?raw'))
})
export class SoundComponent {
    private readonly _soundService: SoundService;

    private readonly _game: IGame;
    private readonly _rules: IRules;
    private _isPlaying: boolean = false;
    private _fadeInterval: NodeJS.Timeout;
    private _fadingMusic: boolean = false;
    private _currentMusic: string;
    private _currentVolume: number = 1;
    private readonly _soundQueue: [number, string][] = [];

    constructor() {
        this._soundService = inject(SoundService);
        const objectFactory = inject(ServiceFactory);
        this._game = objectFactory.GetGame();
        this._rules = objectFactory.GetRules();
        setInterval(this.checkMusicPlaying, 500);
    }

    getCurrentMusic = (): string => {
        const music = this._soundService.getCurrentMusic();

        if (this._rules.setup.fadeMusicInterval) {

            if (!this._currentMusic) {
                this._currentMusic = music;
            }

            if (!this._fadingMusic && music != this._currentMusic) {
                this._fadingMusic = true;
                this._fadeInterval = setInterval(() => this.fade(music), this._rules.setup.fadeMusicInterval);
            }

            return this._currentMusic;
        }

        return music;
    }

    getSoundQueue = (): [number, string][] => {
        Array.from(this._game.sounds.soundQueue).forEach(e => {
            if (!e[1].playing) {
                this._soundQueue.push([e[0], e[1].value]);
                e[1].playing = true;
            }
        });

        return this._soundQueue;
    }

    soundCompleted = (soundKey: number) => {
        this._game.sounds.soundQueue.get(soundKey).completeCallBack?.();
        this._game.sounds.soundQueue.delete(soundKey);
        const index = this._soundQueue.indexOf(this._soundQueue.find(([k, _]) => soundKey === k));

        if (index > -1) {
            this._soundQueue.splice(index, 1);
        }
    }

    // This code is here to (re)start music playback as soon as the user interacts with the browser.
    private readonly checkMusicPlaying = () => {
        if (this._isPlaying) {
            return;
        }

        const backgroundMusicElement = this.getMusicPlayer();

        if (backgroundMusicElement) {
            // This will trigger a warning when the user hasn't interacted with the web page yet. Currently (June 1st 2023),
            // I haven't found a way to silence this warning.
            const audioContext = new window.AudioContext();

            if (audioContext?.state !== 'suspended') {
                backgroundMusicElement.play();
                this._isPlaying = true;
            }
        }
    }

    private readonly fade = (newMusic: string) => {
        const newVolume = this._currentVolume - 0.1;

        if (newVolume >= 0) {
            this._currentVolume = newVolume;
        } else {
            clearInterval(this._fadeInterval);
            this._currentVolume = 1;
            this._currentMusic = newMusic;
            this._fadingMusic = false;
        }

        const backgroundMusicElement = this.getMusicPlayer();
        backgroundMusicElement.volume = this._currentVolume;
    }

    private readonly getMusicPlayer = () => {
        return <HTMLAudioElement>this._game.UIRootElement.getElementsByClassName('backgroundmusic-player')[0];
    }
}