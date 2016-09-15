module QuestForTheKing.Locations {
    export function NecromancerNight(): StoryScript.ILocation {
        return {
            name: 'The Necromancer',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map4
                }              
            ],
                enemies: [
                    Enemies.Necromancer
                    
                ]
        }
    }
}    
