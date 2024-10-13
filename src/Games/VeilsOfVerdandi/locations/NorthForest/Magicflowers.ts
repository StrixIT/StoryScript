import { Location, IGame } from '../../types';
import description from './Magicflowers.html?raw';
import { Brownbear } from '../../enemies/Brownbear';
import { MagicFlower } from '../../items/MagicFlower.ts';
import { NorthRoad } from './NorthRoad';
import {backToForestText} from "../../explorationRules.ts";
import {locationComplete} from "../../sharedFunctions.ts";

export function Magicflowers() {
    return Location({
        name: 'The Magic Flowers',
        description: description,
        destinations: [
            {
                name: backToForestText,
                target: NorthRoad
            }              
        ],            
        enemies: [
            Brownbear()

        ],
        items: [
            MagicFlower(),                
        ],
        leaveEvents:
        [[
            'Leave',
            (game: IGame) => {
                if (game.currentLocation.items.length === 0 && game.currentLocation.enemies.length > 0) {
                    game.currentLocation.enemies.delete(Brownbear);
                }
                
                locationComplete(game, game.currentLocation, () => game.currentLocation.items.length === 0, () => game.currentLocation.items.length === 0);
                return true;
            }
        ]]
    });
}