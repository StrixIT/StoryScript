import { IGame, Feature } from '../types';
import { Passage } from '../locations/passage';
import { Constants } from '../constants';

export function Corridor() {
	return Feature({
		name: 'Corridor',
        description: 'A passage through the undergrowth',
        coords: '492,241,464,196',
        shape: 'rect',
        combinations: {
            combine: [
                {
                    combinationType: Constants.WALK,
                    match: (game, target, tool): string => {
                        game.changeLocation(Passage);
                        return 'You crawl through the passage.';
                    }
                },
            ]
        }
	});
}