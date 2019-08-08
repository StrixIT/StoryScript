module QuestForTheKing.Locations {
    export function Necromancer() {
        return Location({
            name: 'The Necromancer',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map4
                }              
            ],
            enemies: [
                Enemies.Necromancer()
            ]
        });
    }
}