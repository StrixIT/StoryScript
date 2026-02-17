import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {Friend} from "./persons/Friend.ts";
import {Garden} from "./locations/Garden.ts";
import {Start} from "./locations/start.ts";
import {Library} from "./locations/Library.ts";
import {Sword} from "./items/sword.ts";

export const getDemoMode = () => {
    return <IDemoMode>{
        startDelay: 1000,
        party: {
            characters: [
                {
                    name: 'Rutger',
                    hitpoints: 10,
                    currentHitpoints: 10,
                    strength: 2,
                    agility: 1,
                    intelligence: 2,
                    equipment: {}
                }
            ]
        },
        steps: [
            {action: game => game.commands.talk(Friend), delay: 2000},
            {action: game => game.commands.answer('hello', 'fine'), delay: 1000},
            {action: game => game.commands.answer('fine'), delay: 1000},
            {action: game => game.playState = null, delay: 1000},
            {action: game => game.commands.go(Garden), delay: 1000},
            {action: game => game.commands.useAction('LookInPond'), delay: 1000},
            {action: game => game.commands.useAction('SearchShed'), delay: 1000},
            {action: game => game.commands.useBarrierAction('Basement', 'TrapDoor', 'Inspect'), delay: 1000},
            {action: game => game.commands.go(Start), delay: 1000},
            {action: game => game.commands.go(Library), delay: 1000},
            {action: game => game.commands.trade('YourPersonalCloset'), delay: 1000},
            {action: game => game.commands.buy(Sword), delay: 1000},
            {action: game => game.playState = null, delay: 1000},
            {action: game => game.commands.go(Start), delay: 1000},
        ]
    };
}