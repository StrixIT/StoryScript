module QuestForTheKing.Locations {
    export function RefuseFlowerMermaid(): StoryScript.ILocation {
        return {
            name: 'The Mermaid',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                }
            ],           
        }
    }
}
