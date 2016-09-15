module QuestForTheKing.Locations {
    export function GuardiansDay(): StoryScript.ILocation {
        return {
            name: 'The Strange Trees',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map4
                },    
                {
                    text: 'You have the parchment',
                    target: Locations.Gotparchment
                }                      
                    
                ]
        }
    }
}    
