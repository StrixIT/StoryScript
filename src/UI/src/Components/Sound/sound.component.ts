import { GameService } from '../../../../Engine/Services/gameService';
import { Component, NgZone } from '@angular/core';
import template from './sound.component.html';
import { IGame } from '../../../../Engine/Interfaces/game';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { createHash } from '../../../../Engine/globals';

@Component({
    selector: 'sound',
    template: template,
})
export class SoundComponent {
    private _game: IGame;

    constructor(private ngZone: NgZone, private _gameService: GameService, objectFactory: ObjectFactory) {
        this._game = objectFactory.GetGame();
        this.watchSounds();
    }

    soundQueue: Map<number, { value: string, playing: boolean}> = new Map<number, { value: string, playing: boolean}>();

    getCurrentMusic = (): string => this._gameService.getCurrentMusic();

    getSoundQueue = (): { key: number, value: string }[] => {      
        var queue = Array.from(this.soundQueue.entries()).filter(v => !v[1].playing).map(e => 
        {
            // Use this code outside of the angular change detection to remove sounds that are playing from the list
            // without triggering the ExpressionChangedAfterItHasBeenCheckedError error. I got this solution reading
            // https://medium.com/angular-in-depth/boosting-performance-of-angular-applications-with-manual-change-detection-42cb396110fb.
            this.ngZone.runOutsideAngular(()=>{
                setTimeout(() => {
                    this.soundQueue.get(e[0]).playing = true;
                }, 0);
            });

            return { key: e[0], value: e[1].value }; 
        });

        return queue;
    }

    soundCompleted = (sound: { key: number, value: string }) => this.soundQueue.delete(sound.key);

    watchSounds = () => {
        this._game.sounds.soundQueue.push = this._game.sounds.soundQueue.push.proxy((originalScope, originalFunction, sound: string) => {
            this.soundQueue.set(createHash(sound + Math.floor(Math.random() * 1000)), { value: sound, playing: false });

            // I don't really need this. Clean it up.
            originalFunction.call(originalScope, sound);
        })
    }
}