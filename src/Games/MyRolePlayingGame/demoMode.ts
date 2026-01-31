import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {Friend} from "./persons/Friend.ts";
import {Garden} from "./locations/Garden.ts";

export const  getDemoMode = () => {
    return <IDemoMode>{
        startDelay: 2000,
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
        steps: [{
            action: game => {
                game.commands.talk(Friend);
            },
            delay: 2000
        },{
            action: game => {
                game.commands.answer('hello', 'fine');
            },
            delay: 1000
        },{
            action: game => {
                game.commands.answer('fine');
            },
            delay: 1000
        },{
            action: game => {
                game.playState = null;
            },
            delay: 1000
        },{
            action: game => {
                game.commands.go(Garden);
            },
            delay: 2000
        }]
    };
}