module DangerousCave.Locations {
    export function CandleLitCave(): StoryScript.ILocation {
        return {
            name: 'Een grot met kaarslicht',
            destinations: [
                {
                    text: 'Onderzoek het kaarslicht',
                    target: Locations.Arena
                },
                {
                    text: 'Sluip naar de donkere gang',
                    target: Locations.DarkCorridor
                },
                {
                    text: 'Richting ingang',
                    target: Locations.RightCorridor
                }
            ],
            actions: [
                Actions.Search({
                    difficulty: 12,
                    success: (game) => {
                        game.logToLocationLog('Je voelt dat hier kortgeleden sterke magie gebruikt is. Ook zie je aan sporen op de vloer dat hier vaak orks lopen.')
                    },
                    fail: (game) => {
                        game.logToActionLog('Terwijl je rondzoekt, struikel je over een losse steen en maak je veel herrie. Er komt een ork op af!');

                        // Todo: improve;
                        var enemy = Enemies.Orc();
                        var items = [];
                        enemy.items.forEach(x => { items.push(x()); });
                        (<any>enemy).items = items;
                        game.currentLocation.enemies.push(enemy);
                    }
                })
            ]
        }
    }
}