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
import {Dryad} from "../locations/EastForest/Dryad.ts";
import {Guardians} from "../locations/EastForest/Guardians.ts";
import {ForestPond} from "../locations/EastForest/ForestPond.ts";
import {EastRoad} from "../locations/EastForest/EastRoad.ts";
import {CliffWall} from "../locations/EastForest/CliffWall.ts";
import {Darkcave} from "../locations/EastForest/Darkcave.ts";
import {CentralForest} from "../locations/CentralForest/CentralForest.ts";
import {Troll} from "../locations/CentralForest/Troll.ts";
import {Treestump} from "../locations/CentralForest/Treestump.ts";
import {SecretCove} from "../locations/CentralForest/SecretCove.ts";
import {OceanShrine} from "../locations/Sea/OceanShrine.ts";
import {Octopus} from "../locations/Sea/Octopus.ts";
import {IslandMeadow} from "../locations/Sea/IslandMeadow.ts";
import {CastleApproach} from "../locations/Sea/CastleApproach.ts";
import {CastleInside} from "../locations/Sea/CastleInside.ts";
import {Beach} from "../locations/Beach/Beach.ts";
import {Fisherman} from "../locations/Beach/Fisherman.ts";
import {Mermaid} from "../locations/Beach/Mermaid.ts";

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
            {
                location: EastRoad,
                coords: '840,650'
            },
            {
                location: Dryad,
                coords: '795,495'
            },
            {
                location: ForestPond,
                coords: '655,530'
            },
            {
                location: Guardians,
                coords: '1025,830'
            },
            {
                location: CliffWall,
                coords: '1120,890'
            },
            {
                location: Darkcave,
                coords: '1165,925'
            },
            {
                location: CentralForest,
                coords: '1075,500'
            },
            {
                location: Troll,
                coords: '935,530'
            },
            {
                location: Treestump,
                coords: '1175,375'
            },
            {
                location: SecretCove,
                coords: '985,250'
            },
            {
                location: OceanShrine,
                coords: '750,160'
            },
            {
                location: Octopus,
                coords: '465,155'
            },
            {
                location: IslandMeadow,
                coords: '280,220'
            },
            {
                location: CastleApproach,
                coords: '235,190'
            },
            {
                location: CastleInside,
                coords: '235,190'
            },
            {
                location: Beach,
                coords: '420,375'
            },
            {
                location: Fisherman,
                coords: '325,435'
            },
            {
                location: Mermaid,
                coords: '515,310'
            }
        ]
    });
}