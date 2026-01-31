import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {Combinations} from "./combinations.ts";
import {Fountain} from "./features/fountain.ts";
import {Herbs} from "./items/herbs.ts";
import {Corridor} from "./features/corridor.ts";
import {WoundedWarrior} from "./features/woundedWarrior.ts";
import {IFeature} from "./interfaces/feature.ts";
import {IGame} from "./interfaces/game.ts";
import {Flask} from "./items/flask.ts";
import {HealingPotion} from "./items/healingPotion.ts";
import {IAutoplayStep} from "storyScript/Interfaces/autoplayStep.ts";
import {Water} from "./items/water.ts";

export const  getDemoMode = () => {
    return <IDemoMode>{
        startDelay: 5000,
        party: {
            characters: [{}]
        },
        steps: [
            ...getStep(Combinations.LOOKAT, Fountain),
            ...getStep(Combinations.TOUCH, Fountain),
            ...getStep(Combinations.WALK, Corridor),
            ...getStep(Combinations.LOOKAT, WoundedWarrior),
            ...getStep(Combinations.TOUCH, Herbs),
            ...getStep(Combinations.WALK, 'Passage back'),
            ...getStep(Combinations.USE, Fountain, Flask),
            ...getStep(Combinations.USE, Water, Herbs),
            ...getStep(Combinations.WALK, Corridor),
            ...getStep(Combinations.USE, WoundedWarrior, HealingPotion)
        ]
    };
}

function getStep(combination: string, feature: (() => IFeature) | string, tool?: (() => IFeature) | string) {
    let steps: IAutoplayStep[];

    if (tool) {
        steps = [{
            action: (game: IGame) => game.commands.selectCombination(combination),
            delay: 2000
        }, {
            action: (game: IGame) => game.commands.setTool(tool),
            delay: 1000
        }, {
            action: (game: IGame) => game.commands.combine(combination, feature, tool),
            delay: 1000
        }];
    } else {
        steps = [{
            action: (game: IGame) => game.commands.selectCombination(combination),
            delay: 2000
        }, {
            action: (game: IGame) => game.commands.combine(combination, feature),
            delay: 1000
        }];
    }
    
    return steps;
}