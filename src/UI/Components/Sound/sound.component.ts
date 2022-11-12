import { GameService } from 'storyScript/Services/gameService';
import { Component, NgZone } from '@angular/core';
import { IGame } from 'storyScript/Interfaces/game';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'sound',
    template: getTemplate('sound', require('./sound.component.html'))
})
export class SoundComponent {
    private _game: IGame;

    constructor(private ngZone: NgZone, private _gameService: GameService, objectFactory: ObjectFactory) {
        this._game = objectFactory.GetGame();
        this.soundQueue = this._game.sounds.soundQueue;
    }

    soundQueue: Map<number, { value: string, playing: boolean, completeCallBack?: () => void}>;

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

    soundCompleted = (sound: { key: number, value: string }) => {
        this.soundQueue.get(sound.key).completeCallBack?.();
        this.soundQueue.delete(sound.key);
    }
}