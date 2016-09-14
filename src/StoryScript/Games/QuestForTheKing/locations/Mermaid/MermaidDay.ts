module QuestForTheKing.Locations {
    export function MermaidDay(): StoryScript.ILocation {
        return {
            name: 'The Mermaid',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                },    
                {
                    text: 'Help the Mermaid',
                    target: Locations.MermaidHelp
                }            
            ],                        
        }
    }
}
   
