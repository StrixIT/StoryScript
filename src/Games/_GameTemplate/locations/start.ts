import { Location } from '../types'
import { RegisterLocation } from '../../../Engine/ObjectConstructors';

export function Start() {
    return Location({
        name: 'Start',
        destinations: [
            
        ]
    });
}

RegisterLocation(Start);