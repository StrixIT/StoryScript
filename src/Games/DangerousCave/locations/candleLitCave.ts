import { IGame, Location } from '../types';
import description from './candleLitCave.html' 
import { Search } from '../actions/search';
import { Orc } from '../enemies/orc';
import { Arena } from './arena';
import { DarkCorridor } from './darkCorridor';
import { RightCorridor } from './rightCorridor';

export function CandleLitCave() {
    return Location({
        name: 'Een grot met kaarslicht',
        description: description,
        destinations: [
            {
                name: 'Onderzoek het kaarslicht',
                target: Arena
            },
            {
                name: 'Sluip naar de donkere gang',
                target: DarkCorridor
            },
            {
                name: 'Richting ingang',
                target: RightCorridor
            }
        ],
        actions: [
            Search({
                difficulty: 12,
                success: (game: IGame) => {
                    game.logToLocationLog('Je voelt dat hier kortgeleden sterke magie gebruikt is. Ook zie je aan sporen op de vloer dat hier vaak orks lopen.')
                },
                fail: (game: IGame) => {
                    game.logToActionLog('Terwijl je rondzoekt, struikel je over een losse steen en maak je veel herrie. Er komt een ork op af!');
                    game.currentLocation.enemies.push(Orc());
                }
            })
        ]
    });
}