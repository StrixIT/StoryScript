import {LocationMap} from "../types";
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
import {Start} from "../locations/ForestEntry/start.ts";

export function ForestOfMyrr() {
    return LocationMap({
        name: 'Forest of Myrr',
        mapImage: 'gameboard.jpg',
        avatarImage: 'hero.png',
        locationNamesAsTextMarkers: true,
        toggleFullScreen: true,
        showMarkersOnKeyPress: ' ',
        locations: [
            {
                location: Start,
                coords: '220,1105'
            },
            {
                location: NorthRoad,
                coords: '590,635'
            },
            {
                location: SouthRoad,
                coords: '805,1200'
            },
            {
                location: ForestLake,
                coords: '645,915'
            },
            {
                location: Brennus,
                coords: '275,885'
            },
            {
                location: MagicFlower,
                coords: '855,795'
            },
            {
                location: Woodcutter,
                coords: '325,665'
            },
            {
                location: Merchant,
                coords: '1075,1165'
            },
            {
                location: Stonemount,
                coords: '645,1230'
            },
            {
                location: EastRoad,
                coords: '1070,730'
            },
            {
                location: Dryad,
                coords: '910,510'
            },
            {
                location: ForestPond,
                coords: '755,545'
            },
            {
                location: Guardians,
                coords: '1180,855'
            },
            {
                location: CliffWall,
                coords: '1285,920'
            },
            {
                location: Darkcave,
                coords: '1335,950'
            },
            {
                location: CentralForest,
                coords: '1230,390'
            },
            {
                location: Troll,
                coords: '1070,545'
            },
            {
                location: Treestump,
                coords: '1335,385'
            },
            {
                location: SecretCove,
                coords: '1070,230'
            },
            {
                location: OceanShrine,
                coords: '860,165'
            },
            {
                location: Octopus,
                coords: '540,165'
            },
            {
                location: IslandMeadow,
                coords: '325,230'
            },
            {
                location: CastleApproach,
                coords: '275,200'
            },
            {
                location: CastleInside,
                coords: '275,200'
            },
            {
                location: Beach,
                coords: '435,415'
            },
            {
                location: Fisherman,
                coords: '380,450'
            },
            {
                location: Mermaid,
                coords: '595,325'
            }
        ]
    });
}