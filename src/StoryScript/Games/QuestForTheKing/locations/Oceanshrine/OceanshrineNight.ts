module QuestForTheKing.Locations {
    export function OceanshrineNight(): StoryScript.ILocation {
        return {
            name: 'The Ocean Shrine',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                }           

            ]
        }
    }
}    
