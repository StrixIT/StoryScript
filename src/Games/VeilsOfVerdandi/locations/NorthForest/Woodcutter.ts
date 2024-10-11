import {Location} from '../../types';
import description from './Woodcutter.html?raw';
import {Spectre} from '../../enemies/Spectre';
import {Parchment} from '../../items/Parchment';
import {LongBow} from '../../items/LongBow';
import {backToForestText} from "../../explorationRules.ts";
import {NorthRoad} from "./NorthRoad.ts";

export function Woodcutter() {
    return Location({
        name: 'The Woodcutters Cottage',
        description: description,
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
            LongBow(),
        ]
    });
}