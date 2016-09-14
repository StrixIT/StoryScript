module QuestForTheKing.Locations {
    export function Castleapproach(): StoryScript.ILocation {
        return {
            name: 'Approaching the Castle',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                },     
                {
                    text: 'Enter the Castle',
                    target: Locations.CastleInside
                }          
            ],             
        }
    }
}    
