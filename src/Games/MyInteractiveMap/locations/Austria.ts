import {IGame, Location} from '../types';
import description from './Austria.html?raw';
import {Westphalia} from "./Westphalia.ts";
import {Franconia} from "./Franconia.ts";

const triggerSecondaryLocation = (game: IGame, data: Record<string, string>, className: string) => {
    const mapLocation = game.currentMap.locations.find(l => l.location === data.location);

    if (mapLocation) {
        mapLocation.markerElement.style.visibility = className;
    }
}

export function Austria() {
    return Location({
        name: 'Austria',
        description: description,
        destinations: [
			{
				name: 'Franconia',
				target: Franconia
			},
			{
                name: 'Westphalia',
                target: Westphalia
            },
        ],
                triggeredActions: [[
                    'secondary-location-trigger',
                    (game: IGame, activate: boolean, data) => {
                        triggerSecondaryLocation(game, data, activate ? 'visible' : 'hidden');
                    }
                ]]
    });
}
