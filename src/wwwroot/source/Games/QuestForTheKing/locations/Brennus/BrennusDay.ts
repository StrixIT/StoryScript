module QuestForTheKing.Locations {
    export function BrennusDay(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                }              
            ],
                enemies: [
                    Enemies.Brennus
                    
                ]
        }
    }
}    
