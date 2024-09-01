import { Location, IGame } from '../../types';
import description from './Merchant.html?raw';
import { SouthRoad } from './SouthRoad';
import { Merchant as MerchantPerson } from '../../persons/Merchant';

export function Merchant() {
    return Location({
        name: 'The Merchant',
        description: description,
        destinations: [
            {
                name: 'The South Road',
                target: SouthRoad
            }        
        ],
        persons: [
            MerchantPerson()
        ]                
    });
}