namespace DangerousCave.Locations {
    export function Arena() {
        return Location({
            name: 'Een hoek van de grot waar kaarsen branden',
            enemies: [
                Enemies.Orc()
            ],
            destinations: [
                {
                    name: 'De grote grot in',
                    target: Locations.CandleLitCave
                }
            ],
            actions: [
                {
                    text: 'Onderzoek symbool',
                    execute: function (game: IGame) {
                        game.currentLocation.text = game.currentLocation.descriptions['triggered'];
                        var troll = Enemies.Troll();
                        troll.onDefeat = onDefeat;
                        game.currentLocation.enemies.push(troll);
                        game.logToActionLog('Er verschijnt op magische wijze een enorme trol waar het symbool was! Hij valt je aan!');
                    }
                }
            ]
        });

        function onDefeat(game: IGame) {
            game.state = StoryScript.GameState.Play;
            var randomEnemy = game.helpers.randomEnemy();
            game.currentLocation.enemies.push(randomEnemy);
            randomEnemy.onDefeat = this.onDefeat;
        }
    }
}