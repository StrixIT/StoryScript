module QuestForTheKing.Locations {
    export function Treestump(): StoryScript.ILocation {
        return {
            name: 'The Satyr',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                },                                        
                    
                ]
        }
    }
}    
