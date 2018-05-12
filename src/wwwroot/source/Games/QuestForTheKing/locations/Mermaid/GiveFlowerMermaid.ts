module QuestForTheKing.Locations {
    export function GiveFlowerMermaid(): StoryScript.ILocation {
        return {
            name: 'The Mermaid',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                }
            ],
            items: [
                Items.Pearl,
            ]
        }
    }
}
