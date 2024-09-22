import {IGame} from "./interfaces/game.ts";
import {ICompiledLocation} from "./interfaces/location.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {descriptionSelector} from "./sharedFunctions.ts";
import {IItem} from "./interfaces/item.ts";
import {IEnemy} from "./interfaces/enemy.ts";
import {IDestination} from "./interfaces/destination.ts";
import {IAction} from "./interfaces/action.ts";
import {IExplorationRules} from "storyScript/Interfaces/rules/explorationRules.ts";

const dayPartLength = 4;

export const explorationRules = <IExplorationRules>{
    enterLocation: (game: IGame, location: ICompiledLocation, travel: boolean): void => {
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
        
        location.enemies?.forEach(enemy => enemy.inactive = !isEntityActive(game, enemy));
        location.items?.forEach(item => item.inactive = !isEntityActive(game, item));
        location.destinations?.forEach(destination => destination.inactive = !isEntityActive(game, destination));
        location.actions?.forEach(([k, v]) => v.status = !isEntityActive(game, v) ? ActionStatus.Unavailable : v.status);

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

function isEntityActive(game: IGame, entity: IItem | IEnemy | IDestination | IAction): boolean {
    return (!entity.activeNight && !entity.activeDay) || (entity.activeNight && game.worldProperties.isNight) || (entity.activeDay && game.worldProperties.isDay)
}