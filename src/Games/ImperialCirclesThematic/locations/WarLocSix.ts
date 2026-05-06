import { Location } from '../types';
import description from './WarLocSix.html?raw';
import { WarLocTwo } from './WarLocTwo';
import { WarLocThree } from './WarLocThree';
import { WarLocFour } from './WarLocFour';
import { WarLocFive } from './WarLocFive';

export function WarLocSix() {
    return Location({
        name: 'French Revolutionary and Napoleonic Wars',
        description: description,
        destinations: [
            {
                name: 'Wars against the Ottoman Empire',
                target: WarLocTwo,
            },
            {
                name: 'Military conflicts with Louis XIV, King of France',
                target: WarLocThree,
            },
            {
                name: 'War of the Polish Succession',
                target: WarLocFour,
            },
            {
                name: '1757 War against Prussia',
                target: WarLocFive,
            }
        ]
    });
}