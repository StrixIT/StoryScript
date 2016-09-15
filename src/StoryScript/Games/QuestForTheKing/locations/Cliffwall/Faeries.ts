module QuestForTheKing.Locations {
    export function Faeries(): StoryScript.ILocation {
        return {
            name: 'The Cliffwall',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map4
                }           
                    
                ]
        }
    }
}    
