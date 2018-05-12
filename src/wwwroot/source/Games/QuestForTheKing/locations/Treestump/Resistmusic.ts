module QuestForTheKing.Locations {
    export function Resistmusic(): StoryScript.ILocation {
        return {
            name: 'Resisted the Music',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                },                                           
                    
                ]
        }
    }
}    
