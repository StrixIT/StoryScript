import { IGame, Location } from '../../types';
import { Fisherman } from './Fisherman';
import { Magicflowers } from './Magicflowers';
import { Woodcutter } from './Woodcutter';
import { CentralForest } from '../CentralForest/CentralForest';
import description from './NorthRoad.html?raw';
import { Start } from '../ForestEntry/start';

export function NorthRoad() {
	return Location({
		name: 'NorthRoad',
		description: description,
        isHotspot: true,
		destinations: [
			{
                name: 'The Woodcutters Lodge',
                target: Woodcutter,
				style: 'location-danger'
            },
			{
                name: 'The Magic Flower',
                target: Magicflowers,
				style: 'location-danger'
            },
			{
                name: 'The Fisherman\'s Cottage',
                target: Fisherman,
				style: 'location-danger'
            },
			{
                name: 'The Forest Entry',
                target: Start,
            },
			{
                name: 'The Central Forest',
                target: CentralForest,
            }
		]
	});
}