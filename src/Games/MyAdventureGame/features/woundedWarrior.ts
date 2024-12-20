import {Feature, IGame} from '../types';
import { Combinations } from '../combinations';
import { Flask } from '../items/flask';

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
                }
            ]
        }
    });
}