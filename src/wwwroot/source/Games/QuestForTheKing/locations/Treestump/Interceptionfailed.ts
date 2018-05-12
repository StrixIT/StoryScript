module QuestForTheKing.Locations {
    export function Interceptionfailed(): StoryScript.ILocation {
        return {
            name: 'You fail to intercept the man',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3
                },                                           
                    
                ]
        }
    }
}    
