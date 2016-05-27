module StoryScript.Locations {
    export function Arena(): ILocation {
        return {
                name: 'Een hoek van de grot waar kaarsen branden',
                enemies: [
                    Enemies.Orc
                ],
                destinations: [
                    {
                        text: 'De grote grot in',
                        target: Locations.CandleLitCave
                    }
                ],
                actions: [
                    {
                        text: 'Onderzoek symbool',
                        type: 'skill',
                        execute: function (game: DangerousCave.Game) {
                            game.currentLocation.text = game.currentLocation.descriptions['triggered'];
                            var troll = Enemies.Troll();
                            game.currentLocation.enemies.push(troll);
                            troll.onDefeat = onDefeat;
                            game.logToActionLog('Er verschijnt op magische wijze een enorme trol waar het symbool was! Hij valt je aan!');
                        }
                    }
                ]
            }

        function onDefeat(game: DangerousCave.Game) {
            var randomEnemy = Actions.RandomEnemy(game);
            randomEnemy.onDefeat = this.onDefeat;
        }
    }
}