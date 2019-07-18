module QuestForTheKing.Locations {
    export function Brennus() {
        return Location({
            name: 'Brennus',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1,
                    activeDay: true
                },
                {
                    name: 'Approach the Tent',
                    target: Locations.BrennusApproach,
                    activeNight: true
                },
                {
                    name: 'Leave',
                    target: Locations.Quest1map1,
                    activeNight: true               
                },
            ],
            enemies: [
                Enemies.Brennus()  
            ],
            enterEvents: [
                (game: IGame) => {
                    if (game.worldProperties.isNight) {
                        game.currentLocation.enemies.map(e => e.inactive = true);
                    }
                }
            ]
        });
    }
}    
