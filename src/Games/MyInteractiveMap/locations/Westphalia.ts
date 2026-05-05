import {IGame, Location} from '../types';
import description from './Westphalia.html?raw';
import {Austria} from "./Austria.ts";
import {Franconia} from "./Franconia.ts";

const triggerSecondaryLocation = (game: IGame, data: Record<string, string>, className: string) => {
    const mapLocation = game.currentMap.locations.find(l => l.location === data.location);

    if (mapLocation) {
        mapLocation.markerElement.style.visibility = className;
    }
}

export function Westphalia() {
    return Location({
        name: 'Westphalia',
        description: description,
        destinations: [
			{
				name: 'Austria',
				target: Austria
			},
			{
                name: 'Franconia',
                target: Franconia
            }
        ],
        triggeredEvents: [[
            'secondary-location-trigger',
            (game: IGame, activate: boolean, data) => {
                triggerSecondaryLocation(game, data, activate ? 'visible' : 'hidden');
            }
        ]]
    });
}
