module QuestForTheKing.Locations {
    export function ForestPondDay(): StoryScript.ILocation {
        return {
            name: 'The Forest Pond',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],
                enemies: [
                    Enemies.DarkDryad
                    
            ],
                items: [
                    Items.Magicshield,
                ]
        }
    }
}    
