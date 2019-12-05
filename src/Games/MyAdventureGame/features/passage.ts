import { Feature } from '../types';
import { Constants } from '../constants';
import * as locPassage from '../locations/passage'

export function Passage() {
    return Feature({
        name: 'passage',
        coords: '492,241,464,196',
        shape: 'rect',
        description: 'A passage through the undergrowth',
        combinations: {
            combine: [
                {
                    combinationType: Constants.WALK,
                    match: (game, target, tool): string => {
                        game.changeLocation(locPassage.Passage);
                        return 'You crawl through the passage.';
                    }
                },
            ]
        }
    });
}