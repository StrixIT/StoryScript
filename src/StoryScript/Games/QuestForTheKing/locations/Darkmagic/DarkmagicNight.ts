module QuestForTheKing.Locations {
    export function DarkmagicNight(): StoryScript.ILocation {
        return {
            name: 'Dark Magic',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map4
                }              
            ],
                enemies: [
                    Enemies.Rockwolf
                    
                ]
        }
    }
}    
