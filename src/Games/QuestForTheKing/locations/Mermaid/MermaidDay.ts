module QuestForTheKing.Locations {
    export function MermaidDay() {
        return BuildLocation({
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
        });
    }
}
   
