import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {Combinations} from "./combinations.ts";
import {Fountain} from "./features/fountain.ts";
import {Herbs} from "./items/herbs.ts";

export const  getDemoMode = () => {
    return <IDemoMode>{
        startDelay: 2000,
        party: {
            characters: [{}]
        },
        steps: [{
            action: game => {
                game.activeCharacter.items.add(Herbs);
                game.commands.selectCombination(Combinations.USE);
            },
            delay: 1000
        },{
            action: game => {
                game.commands.setTool(Fountain);
            },
            delay: 1000
        },{
            action: game => {
                game.commands.combine(Combinations.USE, Fountain, Herbs);
            },
            delay: 1000
        }]
    };
}