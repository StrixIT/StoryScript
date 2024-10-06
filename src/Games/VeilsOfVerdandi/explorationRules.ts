import {IGame} from "./interfaces/game.ts";
import {ICompiledLocation} from "./interfaces/location.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {descriptionSelector} from "./sharedFunctions.ts";
import {IItem} from "./interfaces/item.ts";
import {IEnemy} from "./interfaces/enemy.ts";
import {IDestination} from "./interfaces/destination.ts";
import {IAction} from "./interfaces/action.ts";
import {IExplorationRules} from "storyScript/Interfaces/rules/explorationRules.ts";
import {Spectre} from "./enemies/Spectre.ts";
import {Bandit} from "./enemies/Bandit.ts";
import {Brownbear} from "./enemies/Brownbear.ts";
import {ShadowDog} from "./enemies/ShadowDog.ts";
import {Wolf} from "./enemies/Wolf.ts";
import {Rest} from "./actions/Rest.ts";

const dayPartLength = 4;

const dayEncounters = <[() => IEnemy][]>[
    [Bandit],
    [Bandit],
    [Bandit, Bandit],
    [Brownbear],
    [Wolf],
    [Wolf],
    [Wolf, Wolf]
];

const nightEncounters = <[() => IEnemy][]>[
    [Spectre],
    [Spectre],
    [Spectre],
    [ShadowDog],
    [ShadowDog],
    [ShadowDog],
    [ShadowDog]
];

let dayEncounterPile = [];
let nightEncounterPile = [];

// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(encounters: [() => IEnemy][]): [() => IEnemy][] {
    const array = [...encounters];

    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const explorationRules = <IExplorationRules>{
    enterLocation: (game: IGame, location: ICompiledLocation, travel: boolean): void => {
        if (!dayEncounterPile.length) {
            dayEncounterPile = shuffle(dayEncounters);
        }

        if (!nightEncounterPile.length) {
            nightEncounterPile = shuffle(nightEncounters);
        }

        updateTime(game, travel);
        location.enemies?.forEach(enemy => enemy.inactive = !isEntityActive(game, enemy));
        location.items?.forEach(item => item.inactive = !isEntityActive(game, item));
        location.destinations?.forEach(destination => destination.inactive = !isEntityActive(game, destination));
        location.actions?.forEach(([k, v]) => v.status = !isEntityActive(game, v) ? ActionStatus.Unavailable : v.status);

        if (location.isHotspot) {
            if (!location.hotSpotCleared && !location.enemies.length) {
                const encounterPile = game.worldProperties.isDay ? dayEncounterPile : nightEncounterPile;
                const hotSpotEncounter = encounterPile.pop();
                hotSpotEncounter.forEach(e => location.enemies.add(e));
            }

            const restDay = game.worldProperties.isDay && !game.worldProperties.hasRestedDuringDay;
            const restNight = game.worldProperties.isNight && !game.worldProperties.hasRestedDuringNight;
            const actionKey = game.worldProperties.isDay ? 'RestDay' : 'RestNight';

            if (restDay || restNight && !location.activeActions.find(a => a[0] === actionKey)) {
                const restAction = Rest();
                restAction.activeDay = game.worldProperties.isDay;
                restAction.activeNight = game.worldProperties.isNight;
                location.actions.add([actionKey, restAction]);
            }
        }

        if (game.worldProperties.isNight) {
            const element = <HTMLElement>game.UIRootElement?.querySelector('location-container');

            if (element) {
                element.style.cssText = 'filter: brightness(50%);';
            }
        }

        if (!travel) {
            game.currentLocation.description = game.currentLocation.descriptions[descriptionSelector(game)];
        }
    },

    descriptionSelector: descriptionSelector
}

function updateTime(game: IGame, travel: boolean): void {
    if (travel) {
        if (typeof game.worldProperties.isDay === 'undefined') {
            game.worldProperties.isDay = true;
            game.worldProperties.isNight = false;
        }

        game.worldProperties.travelCounter ??= 0;
        game.worldProperties.travelCounter++;
        const duskDawn = game.worldProperties.travelCounter % dayPartLength === 0;

        if (duskDawn) {
            game.worldProperties.isDay = !game.worldProperties.isDay;
            game.worldProperties.isNight = !game.worldProperties.isNight;
        }

        game.worldProperties.timeOfDay = game.worldProperties.isDay ? 'day' : 'night';
    }
}

function isEntityActive(game: IGame, entity: IItem | IEnemy | IDestination | IAction): boolean {
    return (!entity.activeNight && !entity.activeDay) || (entity.activeNight && game.worldProperties.isNight) || (entity.activeDay && game.worldProperties.isDay)
}