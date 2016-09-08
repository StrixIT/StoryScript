module QuestForTheKing.Locations {
    export function MerchantDay(): StoryScript.ILocation {
        return {
            name: 'The Merchant',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                },  
               
            ]
                                       
        }
    }
}    
