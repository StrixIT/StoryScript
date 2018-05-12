module QuestForTheKing.Locations {
    export function Opencage(): StoryScript.ILocation {
        return {
            name: 'Opening the Cage',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }                   
            ]
        }
    }
}    
