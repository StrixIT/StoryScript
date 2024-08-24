import {Location} from '../types'
import {ShipBow} from './ShipBow';
import {Shipsdeck} from './shipsdeck';
import {ShipStern} from './shipStern';
import description from './Start.html?raw'

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        destinations: [
            {
                name: 'Look around',
                target: Shipsdeck,
            },
            {
                name: 'Go to the back of the ship',
                target: ShipStern,
            },
            {
                name: 'Go to the front of the ship',
                target: ShipBow,
            },
        ]
    });
}