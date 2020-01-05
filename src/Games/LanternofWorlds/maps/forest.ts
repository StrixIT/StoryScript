import { IFeatureCollection } from 'storyScript/Interfaces/storyScript';
import { IMapData, TileType, createFeatureMap } from '../maps';
import { Warrior } from '../locations/Introduction/Warrior';
import { Druidstart } from '../locations/Introduction/Druidstart';
import { Village } from '../locations/Village';

var _forestMap: IFeatureCollection;

export function forestMap() {
    if (!_forestMap) {
        var mapData = <IMapData>{
            picture: 'maps/Forest.jpg',
            tilePrefix: 'fo',
            tileType: TileType.Hexagon,
            rows: 4,
            columns: 4,
            tileHeight: 226,
            tileWidth: 305,
            tileOffsetY: 169,
            tileOffsetX: 56,
            missingTiles: [
                '1-1',
                '4-1',
                '4-2',
                '4-4'
            ]
        };

        var tileAdditions = [
            ['1-3', Warrior],
            ['1-2', Village],
            ['2-2', Druidstart]
        ];

        _forestMap = createFeatureMap(mapData, tileAdditions);
    }

    // Todo: this does not get reset on game restart. Use one of the setup rules?
    return _forestMap;
}