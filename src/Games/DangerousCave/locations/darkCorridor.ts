import { IGame, Location } from '../types';
import description from './darkCorridor.html'
import { Orc } from '../enemies/orc';
import { CandleLitCave } from './candleLitCave';
import { CrossRoads } from './crossRoads';

export function DarkCorridor() {
    return Location({
        name: 'Een donkere smalle gang',
        description: description,
        enemies: [
            Orc()
        ],
        destinations: [
            {
                name: 'Richting grote grot (oost)',
                target: CandleLitCave
            },
            {
                name: 'Richting kruispunt (west)',
                target: CrossRoads
            }
        ],
    });
}