module QuestForTheKing.Locations {
    export function TrollNight(): StoryScript.ILocation {
        return {
            name: 'The Troll',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                },
                {
                    text: 'Open the Cage',
                    target: Locations.Opencage
                }
            ],
            enemies: [
                Enemies.Troll             
            ]
        }
    }
}    
