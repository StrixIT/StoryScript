module QuestForTheKing.Locations {
    export function OpencageNight(): StoryScript.ILocation {
        return {
            name: 'Opening the Cage',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                }                   
            ]
        }
    }
}    
