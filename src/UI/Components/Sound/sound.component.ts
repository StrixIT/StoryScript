import { GameService } from 'storyScript/Services/gameService';
import { Component, NgZone } from '@angular/core';
import { IGame } from 'storyScript/Interfaces/game';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { getTemplate } from '../../helpers';
import { IRules } from 'storyScript/Interfaces/storyScript';

@Component({
    selector: 'sound',
    template: getTemplate('sound', require('./sound.component.html'))
})
export class SoundComponent {
    private _game: IGame;
    private _rules: IRules;
    private _fadeInterval: NodeJS.Timer;
    private _fadingMusic: boolean = false;
    private _currentMusic: string;
    private _currentVolume: number = 1;

    constructor(private ngZone: NgZone, private _gameService: GameService, objectFactory: ObjectFactory) {
        this._game = objectFactory.GetGame();
        this._rules = objectFactory.GetRules();
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
            this.ngZone.runOutsideAngular(()=>{
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

        var backgroundMusicElement = <HTMLAudioElement>this._game.UIRootElement.getElementsByClassName('backgroundmusic-player')[0];
        backgroundMusicElement.volume = this._currentVolume;
    }
}