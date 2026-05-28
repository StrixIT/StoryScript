import { IGame, Location } from '../types';
import description from './Franconia.html?raw';
import { Westphalia } from "./Westphalia.ts";
import { Austria } from "./Austria.ts";

const triggerSecondaryLocation = (game: IGame, data: Record<string, string>, className: string) => {
    const mapLocation = game.currentMap.locations.find(l => l.location === data.location);

    if (mapLocation) {
        mapLocation.markerElement.style.visibility = className;
    }
}

export function Franconia() {
    return Location({
        name: 'Franconia',
        description: description,
        destinations: [
            {
                name: 'Austria',
                target: Austria
            },
            {
                name: 'Westphalia',
                target: Westphalia
            }
        ],
        triggeredActions: [[
                    'secondary-location-trigger',
                    (game: IGame, activate: boolean, data) => {
                        triggerSecondaryLocation(game, data, activate ? 'visible' : 'hidden');
                    }
                ]]
    });
}