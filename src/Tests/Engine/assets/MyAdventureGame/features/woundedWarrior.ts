import {Feature, IGame} from '../types';
import {Combinations} from '../combinations';
import {Flask} from '../items/flask';
import {HealingPotion} from "../items/healingPotion.ts";
import {GameState} from "storyScript/Interfaces/enumerations/gameState.ts";

export function WoundedWarrior() {
    return Feature({
        name: 'Wounded warrior',
        combinations: {
            failText: 'That won\'t help him.',
            combine: [
                {
                    combinationType: Combinations.LOOKAT,
                    match: (game: IGame, target, tool): string => {
                        if (!game.worldProperties.takenFlask) {
                            game.worldProperties.takenFlask = true;
                            game.activeCharacter.items.add(Flask);
                            return `Looking at the warrior, you see a flask on his belt.
                                    carefully, you remove it.`;
                        }
                        else {
                            return 'You see nothing else that might help.';
                        }
                    }
                },
                {
                    combinationType: Combinations.USE,
                    tool: HealingPotion,
                    match: (game: IGame, target, tool): string => {
                        game.activeCharacter.items.delete(HealingPotion);
                        game.state = GameState.Victory;
                        return 'You help the warrior drink some of the healing potion. He starts to feel better right away.';
                    }
                }
            ]
        }
    });
}