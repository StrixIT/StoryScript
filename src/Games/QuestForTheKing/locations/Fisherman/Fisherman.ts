module QuestForTheKing.Locations {
    export function Fisherman() {
        return Location({
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
   
