module QuestForTheKing.Locations {
    export function ForestLake() {
        return Location({
            name: 'Forest Lake',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                }
            ],
            enemies: [
                Enemies.Bandit(),
                Enemies.Bandit(),
                Enemies.Ghost()
            ],
            items: [
                Items.Goldnecklace()
            ],
            leaveEvents: [
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.activeEnemies.length == 0, () => game.currentLocation.items.length == 0);
                }
            ]
        });
    }
}    