import {Location} from '../../types';
import {Guardians} from './Guardians';
import {CentralForest} from '../CentralForest/CentralForest';
import description from './EastRoad.html?raw';
import {hotSpotProperties} from "../../explorationRules.ts";
import {SouthRoad} from "../SouthForest/SouthRoad.ts";
import {Dryad} from "./Dryad.ts";

export function EastRoad() {
    return Location({
        name: 'East Road',
        description: description,
        ...hotSpotProperties,
        destinations: [
            {
                name: 'The Central Forest',
                target: CentralForest,
            },
            {
                name: 'The Dryad Tree',
                target: Dryad,
                style: 'location-danger'
            },
            {
                name: 'The Strange Trees',
                target: Guardians,
                style: 'location-danger'
            },
            {
                name: 'The South Road',
                target: SouthRoad
            }
        ]
    });
}