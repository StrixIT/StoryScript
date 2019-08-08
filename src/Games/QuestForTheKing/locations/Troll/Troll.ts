module QuestForTheKing.Locations {
    export function Troll() {
        return Location({
            name: 'The Troll',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }
            ],
            enemies: [
                Enemies.Troll()          
            ],
            actions: [
                {
                    text: 'Open the cage',
                    execute: (game: IGame) => {
                        game.logToLocationLog(game.currentLocation.descriptions['opencage']);
                        game.worldProperties.freedFaeries = true;
                    }
                }
            ]
        });
    }
}    
