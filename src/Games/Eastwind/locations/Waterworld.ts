import { IGame, ILocation, Location } from '../types';
import { Beach } from './Beach';
import { Coralcastle } from './Coralcastle';
import description from './Waterworld.html';

export function Waterworld() {
	return Location({
		name: 'Waterworld',
		description: description,
		destinations: [
			{
				name: 'Continue...',
				target: Beach,
				inactive: true
			},	
		],
		features: [
		],
		items: [
		],
		enemies: [
		],
		persons: [
		],
		trade: [
		],
		enterEvents: [
			(game: IGame) => {
				setTimeout(() => {
					var mermaidImage = game.UIRootElement.getElementsByClassName('underwater-img')[0];

					if (mermaidImage) {
						mermaidImage.classList.remove('invisible');
					}

					game.currentLocation.destinations[0].inactive = false;
				}, 3000);
			}
			
		],
		leaveEvents: [
		],
		actions: [
		],
		combatActions: [
		],
	});
}