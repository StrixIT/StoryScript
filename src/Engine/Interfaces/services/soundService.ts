import {ISoundPlayer} from 'storyScript';

export interface ISoundService {
    getSounds(): ISoundPlayer;

    getCurrentMusic(): string
}