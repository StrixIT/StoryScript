module QuestForTheKing.Locations {
    export function BrennusApproach(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                }
            ],
            enemies: [
                Enemies.Brennus

            ]
        }
    }
}    
