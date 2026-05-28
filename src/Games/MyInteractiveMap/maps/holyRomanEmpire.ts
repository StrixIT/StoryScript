import {LocationMap} from "../types.ts";
import {Austria} from "../locations/Austria.ts";
import {Bohemia} from "../locations/Bohemia.ts";
import {Franconia} from "../locations/Franconia.ts";
import {Moravia} from "../locations/Moravia.ts";
import {Nuremberg} from "../locations/Nuremberg.ts";
import {Liege} from "../locations/Liege.ts";
import {Luxembourg} from "../locations/Luxembourg.ts";
import {Start} from "../locations/start.ts";
import {Westphalia} from "../locations/Westphalia.ts";
import { Silesia } from "../locations/Silesia.ts";

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
                location: Austria,
                textLabel: 'Austria',
                coords: '820,720',
                markerImage: 'Austria.png'
            },
            {
                location: Bohemia,
                textLabel: 'Bohemia',
                coords: '762,512',
                markerImage: 'reddot.png'
            },
            {
                location: Franconia,
                textLabel: 'Franconia',
                coords: '580,500',
                markerImage: 'Franconia.png'
            },
            {
                location: Liege,
                textLabel: 'Liège',
                coords: '314,425',
                markerImage: 'reddot.png'
            },
            {
                location: Luxembourg,
                textLabel: 'Luxembourg',
                coords: '306,495',
                markerImage: 'reddot.png'
            },
            {
                location: Moravia,
                textLabel: 'Moravia',
                coords: '884,543',
                markerImage: 'reddot.png'
            },
            {
                location: Nuremberg,
                textLabel: 'Nuremberg',
                coords: '600,545',
                markerImage: 'reddot.png'
            },
            {
                location: Silesia,
                textLabel: 'Silesia',
                coords: '890,438',
                markerImage: 'reddot.png'
            },
            {
                location: Westphalia,
                textLabel: 'Westphalia',
                coords: '420,330',
                markerImage: 'Westphalia.png'
            }
        ]
    });
}
