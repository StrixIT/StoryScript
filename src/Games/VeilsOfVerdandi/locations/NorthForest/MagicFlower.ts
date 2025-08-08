import {IGame, Location} from '../../types';
import description from './MagicFlower.html?raw';
import {Brownbear} from '../../enemies/Brownbear';
import {MagicFlower as MagicFlowerItem} from '../../items/MagicFlower.ts';
import {NorthRoad} from './NorthRoad';
import {backToForestText} from "../../explorationRules.ts";
import {locationComplete} from "../../sharedFunctions.ts";
import {getId, hasItem} from "storyScript/utilityFunctions.ts";

export function MagicFlower() {
    return Location({
        name: 'The Magic Flowers',
        description: description,
        picture: true,
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
            MagicFlowerItem()
        ],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    if (!game.currentLocation.items.get(MagicFlowerItem) && !hasItem(game.party, getId(MagicFlowerItem))) {
                        game.currentLocation.items.add(MagicFlowerItem);
                    }

                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length === 0, () => game.currentLocation.hasVisited);
                    return true;
                }
            ]]
    });
}