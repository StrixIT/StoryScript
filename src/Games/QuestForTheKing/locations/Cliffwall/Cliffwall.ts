module QuestForTheKing.Locations {
    export function Cliffwall() {
        return Location({
            name: 'The Cliffwall',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map4
                },    
                {
                    name: 'The Dark Cave',
                    target: Locations.Darkcave
                }                                     
            ],
            enemies: [
                Enemies.Twoheadedwolf()
            ]
        });
    }
}    
