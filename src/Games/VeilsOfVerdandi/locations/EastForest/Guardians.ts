import {Location} from '../../types';
import description from './Guardians.html?raw';
import {CliffWall} from './CliffWall.ts';
import {Parchment} from '../../items/Parchment';
import {EastRoad} from "./EastRoad.ts";
import {backToForestText} from "../../explorationRules.ts";

export function Guardians() {
    return Location({
        name: 'The Strange Trees',
        description: description,
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
        ]
    });
}