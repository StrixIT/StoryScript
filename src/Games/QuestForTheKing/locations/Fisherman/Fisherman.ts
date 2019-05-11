module QuestForTheKing.Locations {
    export function Fisherman() {
        return BuildLocation({
            name: 'The Fishermans Cottage',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }                                       
            ]
        });
    }
}
   
