import {IGame} from "./interfaces/game.ts";
import {ICompiledLocation, ILocation} from "./interfaces/location.ts";
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
import {Rest, RestDay, RestNight} from "./actions/Rest.ts";
import nightDescription from './locations/NightDescription.html?raw';
import {equals} from "storyScript/utilityFunctions.ts";
import {Fisherman} from "./locations/Beach/Fisherman.ts";
import {SmallBoat} from "./items/SmallBoat.ts";
import {Beach} from "./locations/Beach/Beach.ts";
import {OceanShrine} from "./locations/Sea/OceanShrine.ts";
import {SecretCove} from "./locations/CentralForest/SecretCove.ts";

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

export const backToForestText = 'To the forest';

export const hotSpotProperties = <ILocation>{
    isHotspot: true,
    actions: <[string, IAction][]>[
        [RestDay, {
            ...Rest(),
            confirmationText: 'Are you sure you want to rest now? You can only rest once during the day, and your enemies also have time to recover!',
            activeDay: true,

        }],
        [RestNight, {
            ...Rest(),
            confirmationText: 'Are you sure you want to rest now? You can only rest once during the night, and your enemies also have time to recover!',
            activeNight: true
        }],
    ],
    enterEvents: [[
        'Night', (game: IGame): boolean => {
            if (game.worldProperties.isNight) {
                game.currentLocation.description = nightDescription;

                Object.keys(game.locations).forEach(k => {
                    const location = game.locations[k];
                    const event = location.enterEvents?.find(a => a[0] === 'Night')?.[0];

                    if (event) {
                        location.enterEvents.delete(event);
                    }
                });
            }

            // Don't delete the event when the location is visited during the day. Return true
            // at night too, as the event is deleted by the code already.
            return true;
        }]]
};

export const explorationRules = <IExplorationRules>{
    enterLocation: (game: IGame, location: ICompiledLocation, travel: boolean): void => {
        if (!location) {
            return;
        }
        
        if (!dayEncounterPile.length) {
            dayEncounterPile = shuffle(dayEncounters);
        }

        if (!nightEncounterPile.length) {
            nightEncounterPile = shuffle(nightEncounters);
        }

        updateTime(game, travel);
        location.persons?.forEach(person => person.inactive = !isEntityActive(game, person));
        location.enemies?.forEach(enemy => enemy.inactive = !isEntityActive(game, enemy));
        location.items?.forEach(item => item.inactive = !isEntityActive(game, item));
        location.destinations?.forEach(destination => destination.inactive = !isEntityActive(game, destination));
        location.actions?.forEach(([_, v]) => v.inactive = !isEntityActive(game, v));

        if (location.isHotspot) {
            if (!location.hotSpotCleared && !location.enemies.length) {
                const encounterPile = game.worldProperties.isDay ? dayEncounterPile : nightEncounterPile;
                const hotSpotEncounter = encounterPile.pop();
                hotSpotEncounter.forEach(e => location.enemies.add(e));
            }
        }

        if (game.worldProperties.isNight) {
            const element = game.UIRootElement?.querySelector<HTMLElement>('location-container');

            if (element) {
                element.style.cssText = 'filter: brightness(50%);';
            }
        }

        game.currentLocation.descriptionSelector = undefined;
    },

    leaveLocation: (game: IGame, location: ICompiledLocation, newLocationId: string) => {
        if (!location) {
            return;
        }
        
        const character = game.party.characters.find(c => c.items.find(i => equals(i, SmallBoat)));
        const boat = character?.items.find(i => equals(i, SmallBoat));

        if (!boat) {
            return;
        }
        
        let drop = false;

        if (equals(location, Fisherman) && equals(newLocationId, Beach)) {
            drop = true;
        }

        if (equals(location, SecretCove) && !equals(newLocationId, OceanShrine)) {
            drop = true;
        }

        if (drop) {
            location.items.add(boat);
            character.items.delete(boat);
        }
    },

    descriptionSelector: descriptionSelector
}

function updateTime(game: IGame, travel: boolean): void {
    if (travel && game.currentLocation.isHotspot) {
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
    if (entity.activeNight === undefined && entity.activeDay === undefined) {
        return true;
    } else if (!entity.activeNight && !entity.activeDay) {
        return false;
    }

    return (entity.activeNight && game.worldProperties.isNight) || (entity.activeDay && game.worldProperties.isDay);
}