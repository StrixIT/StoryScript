import {Location} from '../../types';
import description from './Merchant.html?raw';
import {SouthRoad} from './SouthRoad';
import {Merchant as MerchantPerson} from '../../persons/Merchant';
import {backToForestText} from "../../explorationRules.ts";

export function Merchant() {
    return Location({
        name: 'The Merchant',
        description: description,
        picture: true,
        destinations: [
            {
                name: backToForestText,
                target: SouthRoad
            }
        ],
        persons: [
            MerchantPerson()
        ]
    });
}