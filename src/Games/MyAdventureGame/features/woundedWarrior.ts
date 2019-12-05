import { Feature } from '../types';
import { Constants } from '../constants';
import { Flask } from '../items/flask';

export function WoundedWarrior() {
    return Feature({
        name: 'Wounded warrior',
        combinations: {
            failText: 'That won\'t help him.',
            combine: [
                {
                    combinationType: Constants.LOOKAT,
                    match: (game, target, tool): string => {
                        if (!game.worldProperties.takenFlask) {
                            game.worldProperties.takenFlask = true;
                            game.character.items.push(Flask);
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