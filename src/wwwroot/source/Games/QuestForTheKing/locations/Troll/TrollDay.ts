module QuestForTheKing.Locations {
    export function TrollDay(): StoryScript.ILocation {
        return {
            name: 'The Troll',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                },
                {
                    name: 'Open the Cage',
                    target: Locations.Opencage
                }
            ],
            enemies: [
                Enemies.Troll             
            ]
        }
    }
}    
