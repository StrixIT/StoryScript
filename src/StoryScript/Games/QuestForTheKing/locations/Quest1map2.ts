module QuestForTheKing.Locations {
    export function Quest1map2(): StoryScript.ILocation {
        return {
            name: 'The Northern Forest',
            destinations: [
                {
                    text: 'Go to the Magic Flower',
                    target: Locations.MagicflowersDay
                },
                {
                    text: 'Go to the Fishermans Cottage',
                    target: Locations.FishermanDay
                },
                {
                    text: 'Go to the Mermaid',
                    target: Locations.MermaidDay
                },       
                {
                    text: 'Go to the Forest Pond',
                    target: Locations.ForestPondDay
                },  
                {
                    text: 'Go to the Honeycom Castle',
                    target: Locations.HoneycastleDay
                },      
                {
                    text: 'Go to the Octopus',
                    target: Locations.OctopusDay
                },

            
            ]    
           
        }
    }
}