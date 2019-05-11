module QuestForTheKing.Locations {
    export function Dryad() {
        return BuildLocation({
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
