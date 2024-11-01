import {IGame, Location} from '../../types';
import description from './Treestump.html?raw';
import {backToForestText} from "../../explorationRules.ts";
import {CentralForest} from "./CentralForest.ts";
import {Satyr} from "../../enemies/Satyr.ts";
import {check, locationComplete} from "../../sharedFunctions.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";

export function Treestump() {
    return Location({
        name: 'The Tree Stump',
        description: description,
        picture: true,
        destinations: [
            {
                name: backToForestText,
                target: CentralForest,
                inactive: true
            },
        ],
        actions: [
            ['Listen', {
                text: 'Listen to the music',
                execute: (game: IGame) => {
                    const listenCheckSucceeded = check(game, 3);

                    if (listenCheckSucceeded) {
                        // If the player resists the music, allow him to catch the Satyr
                        game.currentLocation.descriptionSelector = 'resistmusic';
                        game.currentLocation.actions.get('intercept')[1].status = ActionStatus.Available;
                    } else {
                        // If the player fails to resist the music, the Satyr takes half the party's gold. Enable the exit.
                        game.currentLocation.descriptionSelector = 'failresistmusic';
                        game.party.currency = Math.floor(game.party.currency / 2);
                        game.currentLocation.actions.delete('intercept');
                        game.currentLocation.destinations.map(d => d.inactive = false);
                    }
                }, 
                activeDay: true
            }],
            ['Intercept', {
                text: 'Intercept the strange man',
                execute: (game: IGame) => {
                    const interceptCheckSucceeded = check(game, 4);

                    if (interceptCheckSucceeded) {
                        game.currentLocation.descriptionSelector = 'intercept';
                        game.currentLocation.enemies.add(Satyr);
                    } else {
                        game.currentLocation.descriptionSelector = 'failintercept';
                    }

                    game.currentLocation.destinations.map(d => d.inactive = false);
                },
                status: ActionStatus.Unavailable
            }]
        ],
        leaveEvents:
        [[
            'Leave',
            (game: IGame) => {
                locationComplete(game, game.currentLocation, () => game.currentLocation.actions.length === 0, () => true);
                return true;
            }
        ]]
    });
}