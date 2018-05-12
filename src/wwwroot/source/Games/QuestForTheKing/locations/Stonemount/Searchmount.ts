module QuestForTheKing.Locations {
    export function Searchmount(): StoryScript.ILocation {
        return {
            name: 'Searching the mount',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                }                         
                    
                ]
        }
    }
}    
