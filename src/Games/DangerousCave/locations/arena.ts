import { GameState } from 'storyScript/Interfaces/storyScript';
import { IGame, Location } from '../types';
import description from './arena.html' 
import { Orc } from '../enemies/orc';
import { Troll } from '../enemies/troll';
import { CandleLitCave } from './candleLitCave';

export function Arena() {
    return Location({
        name: 'Een hoek van de grot waar kaarsen branden',
        description: description,
        enemies: [
            Orc()
        ],
        destinations: [
            {
                name: 'De grote grot in',
                target: CandleLitCave
            }
        ],
        actions: [
            {
                text: 'Onderzoek symbool',
                execute: function (game: IGame) {
                    game.worldProperties.onDefeat = onDefeat;
                    var troll = Troll();
                    troll.onDefeat = game.worldProperties.onDefeat;
                    game.currentLocation.enemies.push(troll);
                    game.logToActionLog('Er verschijnt op magische wijze een enorme trol waar het symbool was! Hij valt je aan!');
                }
            }
        ]
    });

    function onDefeat(game: IGame) {
        game.state = GameState.Play;
        var randomEnemy = game.helpers.randomEnemy();
        game.currentLocation.enemies.push(randomEnemy);
        randomEnemy.onDefeat = game.worldProperties.onDefeat;
    }
}