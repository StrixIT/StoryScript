module QuestForTheKing.Locations {
    export function ForestLakeDay(): StoryScript.ILocation {
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
                Enemies.Bandit
            ]
        }
    }
}    