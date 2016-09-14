module QuestForTheKing.Locations {
    export function MermaidNight(): StoryScript.ILocation {
        return {
            name: 'The Mermaid',
            destinations: [
                {
                    text: 'Give the Magic Flower to the Mermaid',
                    target: Locations.GiveFlowerMermaid
                },    
                {
                    text: 'Refuse to give the Flower to the Mermaid',
                    target: Locations.RefuseFlowerMermaid
                },   
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2  
                }
            ],
        }
    }
}
