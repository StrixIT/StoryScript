module QuestForTheKing.Locations {
    export function HoneycastleDay(): StoryScript.ILocation {
        return {
            name: 'The Honeycomb Castle',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                },   
                {
                    text: 'Approach the Castle',
                    target: Locations.Castleapproach
                }            
            ],             
        }
    }
}    
