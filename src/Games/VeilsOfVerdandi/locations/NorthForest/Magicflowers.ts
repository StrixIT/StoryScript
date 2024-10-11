import { Location, IGame } from '../../types';
import description from './Magicflowers.html?raw';
import { Brownbear } from '../../enemies/Brownbear';
import { MagicFlower } from '../../items/MagicFlower.ts';
import { NorthRoad } from './NorthRoad';
import {backToForestText} from "../../explorationRules.ts";

export function Magicflowers() {
    return Location({
        name: 'The Magic Flowers',
        description: description,
        destinations: [
            {
                name: backToForestText,
                target: NorthRoad
            }              
        ],            
        enemies: [
            Brownbear()

        ],
        items: [
            MagicFlower(),                
        ]
    });
}