module QuestForTheKing.Locations {
    export function ForestLake(): StoryScript.ILocation {
        return {
            name: 'Forest Lake',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                }
            ],
            enemies: [
                Enemies.Bandit,
                Enemies.Bandit,
                Enemies.Ghost
            ],
            items: [
                Items.Goldnecklace
            ],
            complete: (game, location) => {
                return locationComplete(game, location, () => location.activeEnemies.length == 0, () => location.items.length == 0);
            }
        }
    }
}    