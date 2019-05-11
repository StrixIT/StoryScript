module QuestForTheKing.Locations {
    export function Dryadreturn() {
        return Location({
            name: 'The Dryad Tree',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                }           

            ]
        });
    }
}    
