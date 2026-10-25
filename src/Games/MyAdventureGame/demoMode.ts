import {IAutoplayStep, IDemoMode} from 'storyScript';
import {Combinations} from "./combinations";
import {Fountain} from "./features/fountain";
import {Herbs} from "./items/herbs";
import {Corridor} from "./features/corridor";
import {WoundedWarrior} from "./features/woundedWarrior";
import {IFeature} from "./interfaces/feature";
import {IGame} from "./interfaces/game";
import {Flask} from "./items/flask";
import {HealingPotion} from "./items/healingPotion";
import {Water} from "./items/water";

export const getDemoMode = () => {
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