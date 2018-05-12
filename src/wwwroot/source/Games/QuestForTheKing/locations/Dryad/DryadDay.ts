module QuestForTheKing.Locations {
    export function DryadDay(): StoryScript.ILocation {
        return {
            name: 'The Dryad Tree',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }           

            ]
        }
    }
}    
