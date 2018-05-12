module QuestForTheKing.Locations {
    export function Quest1map2(): StoryScript.ILocation {
        return {
            name: 'The Northern Forest',
            destinations: [
                {
                    name: 'Go to the Magic Flower',
                    target: Locations.MagicflowersDay
                },
                {
                    name: 'Go to the Fishermans Cottage',
                    target: Locations.FishermanDay
                },
                {
                    name: 'Go to the Mermaid',
                    target: Locations.MermaidDay
                },       
                {
                    name: 'Go to the Forest Pond',
                    target: Locations.ForestPondDay
                },  
                {
                    name: 'Go to the Honeycom Castle',
                    target: Locations.HoneycastleDay
                },      
                {
                    name: 'Go to the Octopus',
                    target: Locations.OctopusDay
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
           
        }
    }
}