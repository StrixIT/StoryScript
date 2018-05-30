module QuestForTheKing.Locations {
    export function MermaidDay(): StoryScript.ILocation {
        return {
            name: 'The Mermaid',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map2
                },    
                {
                    name: 'Help the Mermaid',
                    target: Locations.MermaidHelp
                }            
            ],                        
        }
    }
}
   
