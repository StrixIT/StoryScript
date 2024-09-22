import {IGame} from "./interfaces/game.ts";
import {ICompiledLocation} from "./interfaces/location.ts";
import {Character} from "./character.ts";
import {IItem} from "./interfaces/item.ts";

export function descriptionSelector(game: IGame): string {
    if (game.worldProperties.isNight) {
        return game.currentLocation.completedNight ? 'completednight' :
            game.currentLocation.encounterWonDay ? 'nightafter' :
                'night';


    } else {
        return game.currentLocation.completedDay ? 'completedday' :
            game.currentLocation.encounterWonNight ? 'dayafter' :
                'day';
    }
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
    } else {
        if (!location.completedNight) {
            location.completedNight = completeNight();
        }

        return location.completedNight;
    }
}

export function heal(character: Character, amount: number) {
    character.currentHitpoints += amount;
    character.currentHitpoints = Math.min(character.hitpoints, character.currentHitpoints);
}

export function getTopWeapon(character: Character): IItem {
    let weapon = character.items
        .filter(i => i.damage)
        .sort((a, b) => parseInt(a.damage.substring(2)) - parseInt(b.damage.substring(2)))[0];

    Object.keys(character.equipment).forEach(k => {
        const item = <IItem>character.equipment[k];

        if (item?.damage) {
            if (!weapon || parseInt(item.damage.substring(2)) > parseInt(weapon.damage.substring(2))) {
                weapon = item;
            }
        }
    });

    return weapon;
}