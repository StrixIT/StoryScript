module QuestForTheKing.Locations {
    export function LeaveShadow(): StoryScript.ILocation {
        return {
            name: 'Leaving the shadow alone',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],                     
        }
    }
}    
