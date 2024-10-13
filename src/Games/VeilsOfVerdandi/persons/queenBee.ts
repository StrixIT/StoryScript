import { BeeSting } from '../items/BeeSting.ts';
import { MagicFlower } from '../items/MagicFlower.ts';
import { Person } from '../types';
import description from './QueenBee.html?raw';
import {FlowerForTheQueen} from "../quests/FlowerForTheQueen.ts";

export function QueenBee() {
    return Person({
        name: 'Queen Bee',
        description: description,
        hitpoints: 10,
        canAttack: false,
        items: [
            BeeSting()
        ],
        conversation: {
            showUnavailableReplies: false
        },
        quests: [
            FlowerForTheQueen()
        ]
    });
}