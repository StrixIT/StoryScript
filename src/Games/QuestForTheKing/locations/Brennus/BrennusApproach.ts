module QuestForTheKing.Locations {
    export function BrennusApproach() {
        return Location({
            name: 'Brennus',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                }
            ],
            enemies: [
                Enemies.Brennus()
            ]
        });
    }
}    
