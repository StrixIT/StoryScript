import { Feature } from '../types';
import { Combinations } from '../combinations';
import { Flask } from '../items/flask';
import { Water } from '../items/water';
import { Corridor } from './corridor';
import { Herbs } from '../items/herbs';

export function Fountain() {
    return Feature({
        name: 'Fountain',
        combinations: {
            combine: [
                {
                    combinationType: Combinations.LOOKAT,
                    match: (game, target, tool): string => {
                        return 'You look at the fountain water. It is very clear and reflects the forest.';
                    }
                },
                {
                    combinationType: Combinations.TOUCH,
                    match: (game, target, tool): string => {
                        if (!game.currentLocation.features.get(Corridor)) {
                            game.currentLocation.features.add(Corridor);
                            return `You walk towards the fountain and touch the fountain water.
                                It is a little cold. When you pull back your hand, you hear a soft
                                muttering. It is coming from a small passage in the undergrowth.`;
                        }
                        else {
                            return 'The fountain water is pleasant to the touch.';
                        }
                    }
                },
                {
                    combinationType: Combinations.USE,
                    tool: Flask,
                    match: (game, target, tool): string => {
                        var flask = game.character.items.get(Flask);

                        if (flask) {
                            game.character.items.delete(flask);
                            game.character.items.add(Water);
                            return `You fill the flask with the clear fountain water.`;
                        }
                        else {
                            return 'The fountain water is pleasant to the touch.';
                        }
                    }
                },
                {
                    combinationType: Combinations.USE,
                    tool: Herbs,
                    match: (game, target, tool): string => {
                        return `You throw some leaves into the fountain. They disappear with a strange light.`;
                    }
                }
            ]
        }
    });
}