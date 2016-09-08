module QuestForTheKing.Locations {
    export function BanditsDefeated(): StoryScript.ILocation {
        return {
            name: 'Defeated the Bandits',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                },              
          
            ]
        }
    }
}    


