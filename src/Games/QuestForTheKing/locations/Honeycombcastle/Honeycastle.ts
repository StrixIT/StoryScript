module QuestForTheKing.Locations {
    export function Honeycastle() {
        return Location({
            name: 'The Honeycomb Castle',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                },   
                {
                    name: 'Approach the Castle',
                    target: Locations.Castleapproach
                }            
            ],             
        });
    }
}    
