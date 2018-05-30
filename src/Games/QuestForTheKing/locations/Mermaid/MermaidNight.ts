module QuestForTheKing.Locations {
    export function MermaidNight(): StoryScript.ILocation {
        return {
            name: 'The Mermaid',
            destinations: [
                {
                    name: 'Give the Magic Flower to the Mermaid',
                    target: Locations.GiveFlowerMermaid
                },    
                {
                    name: 'Refuse to give the Flower to the Mermaid',
                    target: Locations.RefuseFlowerMermaid
                },   
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2  
                }
            ],
        }
    }
}
