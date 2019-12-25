import { IBarrier, IDestination } from 'storyScript/Interfaces/storyScript';
import { IGame } from '../types';

export function Inspect(text: string) {
    return function (game: IGame, barrier: IBarrier, destination: IDestination): void {
        if (text) {
            game.logToLocationLog(text);
        }
    }
}