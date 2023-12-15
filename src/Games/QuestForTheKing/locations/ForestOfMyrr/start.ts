import { Location, IGame } from '../../types';
import description from './start.html';
import { Brennus } from '../Brennus';
import { Woodcutter } from '../Woodcutter';
import { ForestLake } from '../ForestLake';
import { Stonemount } from '../Stonemount';
import { Merchant } from '../Merchant';
import { Quest1map2 } from './Quest1map2';
import { Quest1map4 } from './Quest1map4';
import { nightFall } from '../../gameFunctions';

export function Start() {
    return Location({
        name: 'The Forest of Myrr',
        description: description,
        destinations: [
            {
                name: 'Go to the Tent',
                target: Brennus
            },
            {
                name: 'Go to the Woodcutters Lodge',
                target: Woodcutter
            },
            {
                name: 'Go to the Forest Lake',
                target: ForestLake
            },       
            {
                name: 'Go to the Stone Mount',
                target: Stonemount
            },
            {
                name: 'Go to the Merchant',
                target: Merchant
            },
            {
                name: 'Go to the Northern Forest',
                target: Quest1map2,
                style: 'location-danger'
            },               
            {
                name: 'Go to the Southern Forest',
                target: Quest1map4,
                style: 'location-danger'
            }
        ],
        enterEvents: [nightFall]
    });
}