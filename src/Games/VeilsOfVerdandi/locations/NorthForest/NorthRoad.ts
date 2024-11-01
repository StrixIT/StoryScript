import {Location} from '../../types';
import {MagicFlower} from './MagicFlower';
import {Woodcutter} from './Woodcutter';
import {CentralForest} from '../CentralForest/CentralForest';
import description from './NorthRoad.html?raw';
import {Start} from '../ForestEntry/start';
import {hotSpotProperties} from "../../explorationRules.ts";
import {Beach} from "../Beach/Beach.ts";

export function NorthRoad() {
    return Location({
        name: 'NorthRoad',
        description: description,
        ...hotSpotProperties,
        destinations: [
            {
                name: 'The Forest Entry',
                target: Start
            },
            {
                name: 'The Woodcutters Lodge',
                target: Woodcutter,
                style: 'location-danger'
            },
            {
                name: 'The Beach',
                target: Beach
            },
            {
                name: 'The Magic Flower',
                target: MagicFlower,
                style: 'location-danger'
            },
            {
                name: 'The Central Forest',
                target: CentralForest
            }
        ]
    });
}