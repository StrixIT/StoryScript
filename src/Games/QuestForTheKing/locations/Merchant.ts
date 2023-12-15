import { Location, IGame } from '../types';
import description from './Merchant.html';
import { Quest1map1 } from './ForestOfMyrr/Quest1map1';

export function Merchant() {
    return Location({
        name: 'The Merchant',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map1
            },  
            
        ]                        
    });
}