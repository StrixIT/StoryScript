module QuestForTheKing.Locations {
    export function ForestPond() {
        return Location({
            name: 'The Forest Pond',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],
            enemies: [
                Enemies.DarkDryad()
            ],
            items: [
                Items.Magicshield(),
            ]
        });
    }
}    
