import {Location} from '../../types';
import description from './start.html?raw';
import {Brennus} from './Brennus';
import {ForestLake} from './ForestLake';
import {Stonemount} from './Stonemount';
import {NorthRoad} from '../NorthForest/NorthRoad';
import {SouthRoad} from '../SouthForest/SouthRoad';
import {nightFall} from "../../sharedFunctions.ts";

export function Start() {
    return Location({
        name: 'The Forest of Myrr',
        description: description,
        destinations: [
            {
                name: 'The Tent',
                target: Brennus,
                style: 'location-danger'
            },
            {
                name: 'The Forest Lake',
                target: ForestLake,
                style: 'location-danger'
            },
            {
                name: 'The Stone Mount',
                target: Stonemount,
                style: 'location-danger'
            },
            {
                name: 'The Northern Road',
                target: NorthRoad,
            },
            {
                name: 'The Southern Road',
                target: SouthRoad,
            }
        ],
        enterEvents: [[
            'Night', nightFall
        ]]
    });
}