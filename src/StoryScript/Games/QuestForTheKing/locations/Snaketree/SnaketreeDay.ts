module QuestForTheKing.Locations {
    export function SnaketreeDay(): StoryScript.ILocation {
        return {
            name: 'The Snake Tree',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                },     
                {
                    text: 'Taking the Dagger',
                    target: Locations.Takingdagger
                }                                    
            ]
        }
    }
}    
