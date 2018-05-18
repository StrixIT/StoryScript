module QuestForTheKing.Locations {
    export function Merchant(): StoryScript.ILocation {
        return {
            name: 'The Merchant',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                },  
               
            ]
                                       
        }
    }
}    
