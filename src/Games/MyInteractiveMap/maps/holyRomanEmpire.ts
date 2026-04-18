import {LocationMap} from "../types.ts";
import {Start} from "../locations/start.ts";
import {Westphalia} from "../locations/Westphalia.ts";
import {Austria} from "../locations/Austria.ts";
import {Franconia} from "../locations/Franconia.ts";

export function HolyRomanEmpire() {
    return LocationMap({
        name: 'Holy Roman Empire',
        mapImage: 'holy-roman-empire.jpg',
        avatarImage: 'avatar.png',
        locationNamesAsTextMarkers: true,
        clickable: true,
        showMarkersOnKeyPress: ' ',
        toggleFullScreen: true,
        locations: [
            {
                location: Start,
                textLabel: 'Start',
                coords: '255,785'
            },
            {
                location: Franconia,
                textLabel: 'Franconia',
                coords: '580,500',
                markerImage: 'Franconia.png'
            },
            {
                location: Westphalia,
                textLabel: 'Westphalia',
                coords: '430,330',
                markerImage: 'Westphalia.png'
            },
            {
                location: Austria,
                textLabel: 'Austria',
                coords: '820,720',
                markerImage: 'Austria.png'
            }
        ]
    });
}
