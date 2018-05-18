module QuestForTheKing.Locations {
    export function Oceanshrine(): StoryScript.ILocation {
        return {
            name: 'The Ocean Shrine',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                },     
                 {
                    name: 'Touch the Altar',
                    target: Locations.Touchingaltar
                }            

            ]
        }
    }
}    
