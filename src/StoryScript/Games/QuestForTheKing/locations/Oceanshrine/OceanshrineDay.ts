module QuestForTheKing.Locations {
    export function OceanshrineDay(): StoryScript.ILocation {
        return {
            name: 'The Ocean Shrine',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                },     
                 {
                    text: 'Touch the Altar',
                    target: Locations.Touchingaltar
                }            

            ]
        }
    }
}    
