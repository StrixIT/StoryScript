import { IGame, ICompiledLocation } from './types';

export function nightFall(game: IGame): boolean {
    // Todo: one text for night in all forest locations?
    console.log(game.worldProperties.timeOfDay);
    return true;
}

export function locationComplete(game: IGame, location: ICompiledLocation, completeDay: (() => boolean), completeNight: (() => boolean)) {
    if (game.worldProperties.isDay) {
        if (!location.completedDay) {
            location.completedDay = completeDay();
        }

        return location.completedDay;
    }
    else {
        if (!location.completedNight) {
            location.completedNight = completeNight();
        }

        return location.completedNight;
    }
}