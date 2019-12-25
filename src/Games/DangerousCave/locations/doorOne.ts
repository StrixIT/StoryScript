import { IGame, Location } from '../types';
import description from './doorOne.html' 
import { RoomOne } from './roomOne';
import { Unlock } from '../actions/unlock';
import { Search } from '../actions/search';
import { LeftCorridor } from './leftCorridor';

export function DoorOne() {
    return Location({
        name: 'Een donkere gang met een deur',
        description: description,
        destinations: [
            {
                name: 'De kamer in',
                target: RoomOne
            },
            {
                name: 'Donkere gang',
                target: LeftCorridor
            }
        ],
        actions: [
            {
                text: 'Schop tegen de deur',
                execute: (game: IGame) => {
                    var check = Math.floor(Math.random() * 6 + 1);
                    var result;
                    result = check * game.character.kracht;

                    if (result > 8) {
                        game.changeLocation(RoomOne);
                        game.logToLocationLog('Met een enorme klap schop je de deur doormidden. Je hoort een verrast gegrom en ziet een ork opspringen.');
                        return false;
                    }
                    else {
                        game.logToActionLog('Auw je tenen!! De deur is nog heel.');
                        return true;
                    };
                }
            },
            Unlock({
                difficulty: 10,
                success: function (game: IGame) {
                    game.changeLocation(RoomOne);
                    game.logToLocationLog('Met meegebrachte pinnetjes duw je in het slot op het mechanisme tot je een klik voelt. De deur is open!');
                    game.logToLocationLog('Je duwt de deur open en kijkt naar binnen.');
                },
                fail: function (game) {
                }
            }),
            Search({
                difficulty: 10,
                success: (game: IGame) => {
                    game.logToLocationLog('Je tast de deur, vloer en muren af. Hoog aan de rechtermuur vind je aan een haakje een grote sleutel!')
                },
                fail: (game: IGame) => {
                    game.logToLocationLog('Je tast de deur, vloer en muren af. Stenen, hout en gruis. Je vindt niets nuttigs.');
                }
            })
        ]
    });
}