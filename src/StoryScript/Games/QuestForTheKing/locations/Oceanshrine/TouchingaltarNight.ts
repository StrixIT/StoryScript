module QuestForTheKing.Locations {
    export function TouchingaltarNight(): StoryScript.ILocation {
        return {
            name: 'The Ocean Shrine',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                }
            ],
            items: [
                Items.Magicring,            
            ]
        }
    }
}