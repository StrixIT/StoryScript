module QuestForTheKing.Locations {
    export function FishermanNight(): StoryScript.ILocation {
        return {
            name: 'The Fishermans Cottage',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],                       
            items: [
                Items.Boat,                
            ]
        }
    }
}
   
