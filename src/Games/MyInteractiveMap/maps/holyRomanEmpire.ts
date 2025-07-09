import {LocationMap} from "../types.ts";
import {Start} from "../locations/start.ts";

export function HolyRomanEmpire() {
    return LocationMap({
        name: 'Holy Roman Empire',
        mapImage: 'holy-roman-empire.jpg',
        locations: [
            {
                location: Start,
                coords: ''
            }
        ]
    });
}