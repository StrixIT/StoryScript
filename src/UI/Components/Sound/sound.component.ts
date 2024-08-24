import { GameService } from 'storyScript/Services/gameService';
import { Component, NgZone, inject } from '@angular/core';
import { IGame } from 'storyScript/Interfaces/game';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { getTemplate } from '../../helpers';
import { IRules } from 'storyScript/Interfaces/storyScript';

@Component({
    selector: 'sound',
    template: getTemplate('sound', await import('./sound.component.html?raw'))
})
export class SoundComponent {
    private _ngZone: NgZone;
    private _gameService: GameService;

    private _game: IGame;
    private _rules: IRules;
    private _isPlaying: boolean = false;
    private _fadeInterval: NodeJS.Timeout;
    private _fadingMusic: boolean = false;
    private _currentMusic: string;
    private _currentVolume: number = 1;

    constructor() {
        this._ngZone = inject(NgZone);
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this._game = objectFactory.GetGame();
        this._rules = objectFactory.GetRules();
        setInterval(this.checkMusicPlaying, 500);
    }

    getCurrentMusic = (): string => {
        var music = this._gameService.getCurrentMusic();

        if (this._rules.setup.fadeMusicInterval) {

            if (!this._currentMusic)
            {
                this._currentMusic = music;
            }

            if (!this._fadingMusic && music != this._currentMusic)
            {
                this._fadingMusic = true;
                this._fadeInterval = setInterval(() => this.fade(music), this._rules.setup.fadeMusicInterval);
            }

            return this._currentMusic;
        }

        return music;
    }

    getSoundQueue = (): { key: number, value: string }[] => {      
        const soundQueue = this._game.sounds.soundQueue;

        const queue = Array.from(soundQueue.entries()).filter(v => !v[1].playing).map(e => 
        {
            // Use this code outside of the angular change detection to remove sounds that are playing from the list
            // without triggering the ExpressionChangedAfterItHasBeenCheckedError error. I got this solution reading
            // https://medium.com/angular-in-depth/boosting-performance-of-angular-applications-with-manual-change-detection-42cb396110fb.
            this._ngZone.runOutsideAngular(()=>{
                setTimeout(() => {
                    soundQueue.get(e[0]).playing = true;
                }, 0);
            });

            return { key: e[0], value: e[1].value }; 
        });

        return queue;
    }

    soundCompleted = (sound: { key: number, value: string }) => {
        const soundQueue = this._game.sounds.soundQueue;
        soundQueue.get(sound.key).completeCallBack?.();
        soundQueue.delete(sound.key);
    }

    // This code is here to (re)start music playback as soon as the user interacts with the browser.
    private checkMusicPlaying = () => {
        if (this._isPlaying) {
            return;
        }

        var backgroundMusicElement = this.getMusicPlayer(); 

        if (backgroundMusicElement)
        {
            // This will trigger a warning when the user hasn't interacted with the web page yet. Currently (June 1st 2023),
            // I haven't found a way to silence this warning.
            var audioContext = new window.AudioContext();
        
            if (audioContext?.state !== 'suspended') {   
                backgroundMusicElement.play();
                this._isPlaying = true;
            }
        }
    }

    private fade = (newMusic: string) => {
        var newVolume = this._currentVolume - 0.1;

        if(newVolume >= 0) {
            this._currentVolume = newVolume;
        }
        else{
            clearInterval(this._fadeInterval);
            this._currentVolume = 1;
            this._currentMusic = newMusic;
            this._fadingMusic = false;
        }

        var backgroundMusicElement = this.getMusicPlayer();
        backgroundMusicElement.volume = this._currentVolume;
    }

    private getMusicPlayer = () => {
        return <HTMLAudioElement>this._game.UIRootElement.getElementsByClassName('backgroundmusic-player')[0];
    }
}