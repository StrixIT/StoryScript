import {IGame, Location} from '../../types';
import description from './Guardians.html?raw';
import {CliffWall} from './CliffWall.ts';
import {Parchment} from '../../items/Parchment';
import {EastRoad} from "./EastRoad.ts";
import {backToForestText} from "../../explorationRules.ts";
import {locationComplete} from "../../sharedFunctions.ts";

export function Guardians() {
    return Location({
        name: 'The Strange Trees',
        description: description,
        picture: true,
        destinations: [
            {
                name: backToForestText,
                target: EastRoad
            },
            {
                name: 'To the CliffWall',
                target: CliffWall,
                barriers: [
                    ['WallOfBranches', {
                        name: 'Wall of branches',
                        key: Parchment
                    }]]
            }
        ],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    const barrierRemoved = !game.currentLocation.destinations.find(d => d.barriers?.length > 0);
                    locationComplete(game, game.currentLocation, () => barrierRemoved, () => barrierRemoved);
                    return true;
                }
            ]]
    });
}