﻿import { LocationService } from '../../../Engine/Services/LocationService';
import { Healingpotion } from '../items/healingPotion';
import { Sword } from '../items/sword';
import { Location } from '../types'
import { ShipBow } from './ShipBow';
import { Shipsdeck } from './shipsdeck';
import { ShipStern } from './shipStern';
import description from './Start.html'

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        background_class: 'gradient-ship-outside',
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