import {LocationMap} from "../types.ts";
import {Start} from "../locations/start.ts";
import {Westphalia} from "../locations/Westphalia.ts";
import {Carinthia} from "../locations/Carinthia.ts";

export function HolyRomanEmpire() {
    return LocationMap({
        name: 'Holy Roman Empire',
        mapImage: 'holy-roman-empire.jpg',
        avatarImage: 'avatar.png',
        locationNamesAsTextLabels: true,
        clickable: true,
        locations: [
            {
                location: Start,
                textLabel: 'Franconia',
                coords: '580,500'
            },
            {
                location: Westphalia,
                coords: '430,330',
                markerImage: 'westphalia.png'
            },
            {
                location: Carinthia,
                coords: '820,720'
            }
        ]
    });
}