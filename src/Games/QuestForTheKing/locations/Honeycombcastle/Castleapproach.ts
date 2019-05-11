module QuestForTheKing.Locations {
    export function Castleapproach() {
        return BuildLocation({
            name: 'Approaching the Castle',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                },     
                {
                    name: 'Enter the Castle',
                    target: Locations.CastleInside
                }          
            ],             
        });
    }
}    
