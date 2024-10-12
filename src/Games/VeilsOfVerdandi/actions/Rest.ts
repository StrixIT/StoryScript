import {IAction} from "../interfaces/action.ts";
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {IGame} from "../interfaces/game.ts";
export const RestDay = 'RestDay';
export const RestNight = 'RestNight';

export function Rest() {
    return <IAction>({
        text: 'Rest',
        actionType: ActionType.Regular,
        execute: (game: IGame) => {
            game.party.characters.forEach(c => c.currentHitpoints = c.hitpoints);
            game.logToActionLog('You have rested and tended to your wounds. You feel ready again to face the forest.');
            
            if (game.worldProperties.isDay) {
                game.worldProperties.hasRestedDuringDay = true;
                removeActionAndResetHotspots(game.locations, RestDay);
            } else {
                game.worldProperties.hasRestedDuringNight = true;
                removeActionAndResetHotspots(game.locations, RestDay);
            }
        }
    });
}

function removeActionAndResetHotspots(locations, key) {
    Object.keys(locations).forEach(k => {
        const location = locations[k];
        const rest = location.actions?.find(a => a[0] === key)?.[0];

        if (rest) {
            location.actions.delete(rest);
        }
        
        if (location.isHotspot && location.id !== 'start') {
            location.hotSpotCleared = false;
        }
    });
}