module QuestForTheKing.Locations {
    export function Resistmusic(): StoryScript.ILocation {
        return {
            name: 'Resisted the Music',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                },                                           
                    
                ]
        }
    }
}    
