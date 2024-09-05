import {IGame} from "./interfaces/game.ts";
import {ICompiledLocation} from "./interfaces/location.ts";
import {Character} from "./character.ts";

export function descriptionSelector (game: IGame): string {
    return game.worldProperties.travelCounter ?
        game.worldProperties.isNight ?
            game.currentLocation.completedNight ? 'completednight' :
                'night' :
            game.currentLocation.completedDay ? 'completedday' :
                'day' :
        null;
}

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

export function heal(character: Character, amount: number) {
    character.currentHitpoints = Math.min(character.hitpoints, character.currentHitpoints += amount);
}