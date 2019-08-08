module QuestForTheKing.Locations {
    export function Merchant() {
        return Location({
            name: 'The Merchant',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                },  
               
            ]                        
        });
    }
}    
