module QuestForTheKing.Locations {
    export function BrennusApproach(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    text: 'Defeated Brennus',
                    target: Locations.BrennusNightDefeated
                }
            ],
            enemies: [
                Enemies.Brennus

            ]
        }
    }
}    
