import { IFeatureCollection } from 'storyScript/Interfaces/storyScript';
import { IMapData, TileType, createFeatureMap } from '../maps';
import { Cave } from '../locations/Introduction/Cave';

var _caveMap: IFeatureCollection;

export function caveMap() {
    if (!_caveMap) {
        var mapData = <IMapData>{
            picture: 'maps/Cave.jpg',
            tilePrefix: 'ca',
            tileType: TileType.Hexagon,
            rows: 3,
            columns: 6,
            tileHeight: 310,
            tileWidth: 360,
            tileOffsetY: 315,
            tileOffsetX: 360,
            missingTiles: [
                '1-2',
                '1-3',
                '1-5',
                '1-6',
                '2-4',
                '2-5',
                '2-6',
                '3-1'
            ]
        };

        var tileAdditions = [
            ['1-1', Cave]
        ];

        _caveMap = createFeatureMap(mapData, tileAdditions);
    }

    // Todo: this does not get reset on game restart. Use one of the setup rules?
    return _caveMap;
}