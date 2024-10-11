import {Location} from '../../types';
import description from './start.html?raw';
import {Brennus} from './Brennus';
import {ForestLake} from './ForestLake';
import {NorthRoad} from '../NorthForest/NorthRoad';
import {SouthRoad} from "../SouthForest/SouthRoad.ts";

export function Start() {
    return Location({
        name: 'The Forest of Myrr',
        description: description,
        destinations: [
            {
                name: 'The Northern Road',
                target: NorthRoad,
            },
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
                name: 'The South Road',
                target: SouthRoad,
            }
        ]
    });
}