namespace LanternofWorlds {
    var _temparateFeatures: StoryScript.IFeatureCollection;

    export function temparateFeatures() {
        if (!_temparateFeatures) {
            var mapData = <IMapData>{
                picture: 'tile demo.png',
                tilePrefix: 'tm',
                tileType: TileType.Hexagon,
                rows: 3,
                columns: 3,
                startRow: 2,
                tileHeight: 600,
                tileWidth: 800,
                tileGutter: 10
            };

            var tileAdditions = [
                //['12', Locations.Plains],
                //['22', Locations.Start],
                //['31', Locations.Water],
            ];
    
            _temparateFeatures = createFeatureMap(mapData, tileAdditions);
        }

        // Todo: this does not get reset on game restart. Use one of the setup rules?
        return _temparateFeatures;
    }

    export enum TileType {
        Square,
        Hexagon
    }

    export interface ITileFeature {
        tile: string,
        linkToLocation: () => ILocation
    }

    export interface IMapData {
        picture: string;
        tilePrefix: string;
        tileType: TileType;
        rows: number;
        columns: number;
        startRow: number;
        tileWidth: number;
        tileHeight: number;
        tileGutter?: number;
        height?: number;
        width?: number;
    } 

    function createFeatureMap(mapData: IMapData, tileAdditions: (string | (() => ILocation))[][]): StoryScript.IFeatureCollection {
        var map: StoryScript.IFeatureCollection = [];
        map.collectionPicture = mapData.picture;

        var divisions = (mapData.rows - 1) * 10;
        var edgeLength = mapData.tileWidth / 2;

        mapData.height = mapData.tileHeight * mapData.rows + divisions;
        mapData.width = Math.ceil(mapData.columns / 2) * mapData.tileWidth + Math.floor(mapData.columns / 2) * edgeLength + divisions;
            
        for (var i = 1; i <= mapData.rows; i++) {
            for (var j = 1; j <= mapData.columns; j++) {
                var featureName = `${mapData.tilePrefix}${i}${j}`;
                map.push(createTileFeature(mapData, featureName, i, j));
            }
        }

        tileAdditions.forEach(a => {
            var tile = <IFeature>map.filter(t => t.name === `${mapData.tilePrefix}${a[0]}`)[0];

            if (tile) {
                var link = typeof a[1] === 'function' ? (<Function>a[1]).name : a[1].toString();
                tile.linkToLocation = link;
            }
        });

        return map;
    }

    function createTileFeature(mapData: IMapData, name: string, row: number, column: number, linkToLocation?: string): IFeature {
        return StoryScript.DynamicEntity(() => Feature({
                name: name,
                shape: 'poly',
                coords: getTileCoordinates(mapData, row, column),
                linkToLocation: linkToLocation,
                combinations: {
                    combine: [
                        {
                            combinationType: Constants.WALK
                        },
                    ],
                },
            }), name);
    }

    function getTileCoordinates(mapData: IMapData, row: number, column: number): string {
        // Hexagon math at https://rechneronline.de/pi/hexagon.php.       
        var edgeLength = mapData.tileWidth / 2;
        var halfEdge = edgeLength / 2;
        var halfHeight = mapData.tileHeight / 2;

        var offsetTop = (mapData.startRow === 1 ? 0 : (column % 2  * -halfHeight)) + (row - 1) * mapData.tileGutter;
        var offsetleft = (column - 1) * mapData.tileGutter * 2;
        var topY = offsetTop + (row - 1) * mapData.tileHeight
        var topX = offsetleft + halfEdge + (column - 1) * (edgeLength + halfEdge);

        var coords = [
            topX, topY, 
            topX - halfEdge, topY + halfHeight, 
            topX, topY + mapData.tileHeight,
            topX + edgeLength, topY + mapData.tileHeight,
            topX + edgeLength + halfEdge, topY + halfHeight,
            topX + edgeLength, topY
        ];

        return coords.map(c => c.toString()).join(',');
    }
}