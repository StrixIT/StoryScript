import { Location, IGame } from '../types';
import description from './Merchant.html';
import { Start } from './ForestOfMyrr/start';

export function Merchant() {
    return Location({
        name: 'The Merchant',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Start
            },  
            
        ]                        
    });
}