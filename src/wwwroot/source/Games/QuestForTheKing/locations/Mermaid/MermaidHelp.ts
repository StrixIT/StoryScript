module QuestForTheKing.Locations {
    export function MermaidHelp(): StoryScript.ILocation {
        return {
            name: 'Helping the Mermaid',
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
   
