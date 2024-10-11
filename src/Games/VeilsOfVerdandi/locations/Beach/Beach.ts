import {Location} from '../../types';
import description from './Beach.html?raw';
import {Mermaid} from "./Mermaid.ts";
import {NorthRoad} from "../NorthForest/NorthRoad.ts";
import {Fisherman} from "./Fisherman.ts";
import {hotSpotProperties} from "../../explorationRules.ts";

export function Beach() {
    return Location({
        name: 'Beach',
        description: description,
        ...hotSpotProperties,
        destinations: [
            {
                name: 'The North Road',
                target: NorthRoad
            },
            {
                name: 'The Mermaid',
                target: Mermaid,
                style: 'location-danger'
            },
            {
                name: 'The Fisherman\'s Cottage',
                target: Fisherman,
                style: 'location-danger'
            },
        ]
    });
}