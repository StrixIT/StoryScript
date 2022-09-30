import { LocationService } from '../../../Engine/Services/LocationService';
import { Location } from '../types'
import { Shipsdeck } from './shipsdeck';
import description from './Start.html'

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
        target: null,
      },
      {
        name: 'Go to the front of the ship',
        target: null,
      },
        ]
    });
}