import {selectStateListEntry} from "storyScript/Services/sharedFunctions.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {ISoundPlayer} from "storyScript/Interfaces/soundPlayer.ts";
import {ISoundService} from "storyScript/Interfaces/services/ISoundService.ts";

export class SoundService implements ISoundService{
    private _musicStopped: boolean = false;

    constructor(private _game: IGame, private _rules: IRules){}

    getSounds = (): ISoundPlayer => {
        return {
            startMusic: this.startMusic,
            stopMusic: this.stopMusic,
            playSound: this.playSound,
            soundQueue: new Map<number, { value: string, playing: boolean, completeCallBack?: () => void }>,
            playedAudio: []
        }
    }
    
    getCurrentMusic = (): string => {
        if (this._musicStopped || !this._rules.setup?.playList || Object.keys(this._rules.setup.playList).length === undefined) {
            return null;
        }

        return selectStateListEntry(this._game, this._rules.setup.playList);
    }

    private startMusic = (): boolean => this._musicStopped = false;

    private stopMusic = (): boolean => this._musicStopped = true;

    private playSound = (fileName: string, completeCallBack?: () => void): void => {
        this._game.sounds.soundQueue.set(this.createHash(fileName + Math.floor(Math.random() * 1000)), {
            value: fileName,
            playing: false,
            completeCallBack: completeCallBack
        });
    }

    private createHash(value: string): number {
        let hash = 0;

        if (!value || value.length == 0) {
            return hash;
        }

        for (let i = 0; i < value.length; i++) {
            const char = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash;
    }
}