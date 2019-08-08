module QuestForTheKing.Locations {
    export function Quest1map2() {
        return Location({
            name: 'The Northern Forest',
            destinations: [
                {
                    name: 'Go to the Magic Flower',
                    target: Locations.Magicflowers
                },
                {
                    name: 'Go to the Fishermans Cottage',
                    target: Locations.Fisherman
                },
                {
                    name: 'Go to the Mermaid',
                    target: Locations.MermaidDay
                },       
                {
                    name: 'Go to the Forest Pond',
                    target: Locations.ForestPond
                },  
                {
                    name: 'Go to the Honeycom Castle',
                    target: Locations.Honeycastle
                },      
                {
                    name: 'Go to the Octopus',
                    target: Locations.Octopus
                },
                {
                    name: 'Go to the Western Forest',
                    target: Locations.Quest1map1,
                    style: 'location-danger'
                },
                 {
                    name: 'Go to the Eastern Forest',
                    target: Locations.Quest1map3,
                    style: 'location-danger'
                }
            
            ]
        });
    }
}