module QuestForTheKing.Locations {
    export function ForestPondNight(): StoryScript.ILocation {
        return {
            name: 'The Forest Pond',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
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
