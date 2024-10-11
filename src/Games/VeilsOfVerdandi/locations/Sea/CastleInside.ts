import {Location} from '../../types';
import description from './CastleInside.html?raw';
import {QueenBee} from '../../persons/queenBee';
import {Fisherman} from "../Beach/Fisherman.ts";
import {Castleapproach} from "./Castleapproach.ts";
import {getId} from "storyScript/utilityFunctions.ts";

export function CastleInside() {
    return Location({
        name: 'Entering the Castle',
        description: description,
        destinations: [
            {
                name: 'The Fisherman\'s cottage',
                target: Fisherman,
                style: 'location-water'
            },
        ],
        persons: [
            QueenBee()
        ],
        leaveEvents: [[
            'Leave', game => {
                const fisherman = game.locations['fisherman'];
                fisherman.destinations.find(d => d.target === getId(Castleapproach)).target = getId(CastleInside);
            }
        ]]
    });
}