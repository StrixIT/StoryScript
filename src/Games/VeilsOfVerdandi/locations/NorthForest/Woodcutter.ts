import {IGame, Location} from '../../types';
import description from './Woodcutter.html?raw';
import {Spectre} from '../../enemies/Spectre';
import {Parchment} from '../../items/Parchment';
import {backToForestText} from "../../explorationRules.ts";
import {NorthRoad} from "./NorthRoad.ts";
import {QualityBow} from "../../items/QualityBow.ts";
import {locationComplete} from "../../sharedFunctions.ts";

export function Woodcutter() {
    return Location({
        name: 'The Woodcutters Cottage',
        description: description,
        picture: true,
        destinations: [
            {
                name: backToForestText,
                target: NorthRoad
            }
        ],
        enemies: [
            Spectre()
        ],
        items: [
            Parchment(),
            QualityBow(),
        ],
        enterEvents: [[ 'FindGold', game => {
            game.party.currency += 10;
        }]],
        leaveEvents:
        [[
            'Leave',
            (game: IGame) => {
                locationComplete(game, game.currentLocation, () => game.currentLocation.items.length === 0, () => game.currentLocation.items.length === 0);
                
                // Remove the Spectre when the items are taken during the day.
                if (game.currentLocation.completedDay) {
                    game.currentLocation.enemies.clear();
                }
                
                return true;
            }
        ]]
    });
}