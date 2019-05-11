module QuestForTheKing.Locations {
    export function RefuseFlowerMermaid() {
        return BuildLocation({
            name: 'The Mermaid',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }
            ],           
        });
    }
}
