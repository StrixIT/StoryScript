import { Location } from '../types';
import { Herbs } from '../items/herbs';
import { WoundedWarrior } from '../features/woundedWarrior';
import { Combinations } from '../combinations';
import { Start } from './start';
import description from './Passage.html';

export function Passage() {
    return Location({
        name: 'A passage in the undergrowth',
        description: description,
        features: [
            Herbs(),
            WoundedWarrior(),
            {
                name: 'Passage back',
                combinations: {
                    combine: [
                        {
                            combinationType: Combinations.WALK,
                            match: (game, target, tool): string => {
                                game.changeLocation(Start);
                                return 'You crawl back to the fountain.';
                            }
                        }
                    ]
                }
            }
        ]
    });
}