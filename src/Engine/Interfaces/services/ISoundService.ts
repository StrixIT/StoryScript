import {ISoundPlayer} from "storyScript/Interfaces/soundPlayer.ts";

export interface ISoundService {
    getSounds(): ISoundPlayer;
    getCurrentMusic(): string
}