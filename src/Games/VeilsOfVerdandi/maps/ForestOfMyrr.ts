import {LocationMap} from "../types";
import {Start} from "../../MyInteractiveMap/locations/start.ts";
import {NorthRoad} from "../locations/NorthForest/NorthRoad.ts";
import {SouthRoad} from "../locations/SouthForest/SouthRoad.ts";
import {ForestLake} from "../locations/ForestEntry/ForestLake.ts";
import {Brennus} from "../locations/ForestEntry/Brennus.ts";
import {Woodcutter} from "../locations/NorthForest/Woodcutter.ts";
import {MagicFlower} from "../locations/NorthForest/MagicFlower.ts";
import {Merchant} from "../locations/SouthForest/Merchant.ts";
import {Stonemount} from "../locations/SouthForest/Stonemount.ts";

export function ForestOfMyrr() {
    return LocationMap({
        name: 'Forest of Myrr',
        mapImage: 'forest-of-myrr.jpg',
        avatarImage: 'hero.png',
        locationNamesAsTextMarkers: false,
        toggleFullScreen: true,
        locations: [
            {
                location: Start,
                coords: '190,1070'
            },
            {
                location: NorthRoad,
                coords: '470,585'
            },
            {
                location: SouthRoad,
                coords: '700,1155'
            },
            {
                location: ForestLake,
                coords: '560,885'
            },
            {
                location: Brennus,
                coords: '235,860'
            },
            {
                location: MagicFlower,
                coords: '745,770'
            },
            {
                location: Woodcutter,
                coords: '280,650'
            },
            {
                location: Merchant,
                coords: '280,650'
            },
            {
                location: Stonemount,
                coords: '280,650'
            },
        ]
    });
}