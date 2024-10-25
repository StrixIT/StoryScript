import {Location} from '../../types';
import {Treestump} from './Treestump';
import {Troll} from './Troll';
import description from './CentralForest.html?raw';
import {NorthRoad} from '../NorthForest/NorthRoad';
import {hotSpotProperties} from "../../explorationRules.ts";
import {EastRoad} from "../EastForest/EastRoad.ts";
import {SecretCove} from "./SecretCove.ts";

export function CentralForest() {
    return Location({
        name: 'Central Forest',
        description: description,
        ...hotSpotProperties,
        destinations: [
            {
                name: 'The Northern Road',
                target: NorthRoad,
            },
            {
                name: 'The Tree Stump',
                target: Treestump,
                style: 'location-danger'
            },
            {
                name: 'The Secret Cove',
                target: SecretCove,
                inactive: true
            },
            {
                name: 'The Troll',
                target: Troll,
                style: 'location-danger'
            },
            {
                name: 'The Eastern Road',
                target: EastRoad,
            },
        ]
    });
}