module QuestForTheKing.Locations {
    export function Resistmusicfailed(): StoryScript.ILocation {
        return {
            name: 'Failed to resist the music',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                },                                           
                    
                ]
        }
    }
}    
