import {IAction} from "../interfaces/action.ts";
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {IGame} from "../interfaces/game.ts";

export function Rest() {
    return <IAction>({
        text: 'Rest',
        actionType: ActionType.Regular,
        execute: (game: IGame) => {
            game.party.characters.forEach(c => c.currentHitpoints = c.hitpoints);
            
            if (game.worldProperties.isDay) {
                game.worldProperties.hasRestedDuringDay = true;
                removeAction(game.locations, 'RestDay');
            } else {
                game.worldProperties.hasRestedDuringNight = true;
                removeAction(game.locations, 'RestNight');
            }
        }
    });
}

function removeAction(locations, key) {
    Object.keys(locations).forEach(k => {
        const location = locations[k];
        const restDay = location.actions.find(a => a[0] === key)[0];

        if (restDay) {
            location.actions.delete(restDay);
        }
    });
}