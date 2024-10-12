import {IGame} from "./interfaces/game.ts";
import {ICompiledLocation} from "./interfaces/location.ts";
import {Character} from "./character.ts";
import {IItem} from "./interfaces/item.ts";

export function check(game: IGame, challenge: number): boolean {
    const check = game.helpers.rollDice('1d6');
    return check <= challenge;
}

export function descriptionSelector(game: IGame): string {
    let selector: string;

    if (game.worldProperties.isDay) {
        if (game.currentLocation.completedDay) {
            selector = 'daycompleted'
        } else {
            selector = game.currentLocation.encounterWonNight ? 'dayafter' : 'day';
        }
    }

    if (game.worldProperties.isNight) {
        if (game.currentLocation.completedNight) {
            selector = 'nightcompleted'
        } else {
            selector = game.currentLocation.encounterWonNight ? 'nightafter' : 'night';
        }
    }

    return game.currentLocation.descriptions[selector] ? selector : null;
}

export function locationComplete(game: IGame, location: ICompiledLocation, completeDay: (() => boolean), completeNight: (() => boolean)) {
    if (!location.completedDay) {
        location.completedDay = completeDay();
    }

    if (!location.completedNight) {
        location.completedNight = completeNight();
    }
}

export function heal(character: Character, amount: number) {
    const newHitpoints = character.currentHitpoints + amount;
    character.currentHitpoints = newHitpoints > character.hitpoints ? character.hitpoints : newHitpoints;
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