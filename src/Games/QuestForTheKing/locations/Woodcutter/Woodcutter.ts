module QuestForTheKing.Locations {
    export function Woodcutter() {
        return Location({
            name: 'The Woodcutters Cottage',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1                       
                }
            ],
            enemies: [
                Enemies.Ghost()
            ],
            items: [
                Items.Parchment(),
                Items.Bow(),
            ]
        });
    }
}
