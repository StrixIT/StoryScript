module QuestForTheKing.Locations {
    export function GiveFlowerMermaid() {
        return Location({
            name: 'The Mermaid',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }
            ],
            items: [
                Items.Pearl(),
            ]
        });
    }
}
