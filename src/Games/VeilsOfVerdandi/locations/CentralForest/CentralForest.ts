import {Location} from '../../types';
import {Treestump} from './Treestump';
import {Troll} from './Troll';
import description from './CentralForest.html?raw';
import {NorthRoad} from '../NorthForest/NorthRoad';
import {SouthRoad} from '../SouthForest/SouthRoad';
import {hotSpotProperties} from "../../explorationRules.ts";

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
                name: 'The Troll',
                target: Troll,
                style: 'location-danger'
            },
            {
                name: 'The Southern Road',
                target: SouthRoad,
            },
        ]
    });
}