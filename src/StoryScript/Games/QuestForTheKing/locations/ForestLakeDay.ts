module QuestForTheKing.Locations {
    export function ForestLakeDay(): StoryScript.ILocation {
        return {
            name: 'Forest Lake',
            destinations: [
                {
                    text: 'Defeated the Bandits',
                    target: Locations.BanditsDefeated
                }
            ],
            enemies: [
                Enemies.Bandit,
                Enemies.Bandit
            ]
        }
    }
}    