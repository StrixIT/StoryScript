import { Location, IGame } from '../../types';
import description from './Quest1map1.html';
import { Brennus } from '../Brennus/Brennus';
import { Woodcutter } from '../Woodcutter/Woodcutter';
import { ForestLake } from '../Forestlake/ForestLake';
import { Stonemount } from '../Stonemount/Stonemount';
import { Merchant } from '../Merchant/Merchant';
import { Quest1map2 } from './Quest1map2';
import { Quest1map4 } from './Quest1map4';

export function Quest1map1() {
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
        
        ]          
    });
}