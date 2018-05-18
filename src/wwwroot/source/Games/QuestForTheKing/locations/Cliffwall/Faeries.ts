module QuestForTheKing.Locations {
    export function Faeries(): StoryScript.ILocation {
        return {
            name: 'The faeries',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map4
                }           
                    
                ]
        }
    }
}    
