module QuestForTheKing.Locations {
    export function ForestLakeNight(): StoryScript.ILocation {
        return {
            name: 'Forest Lake',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                }
            ],
            items: [
                Items.Goldnecklace     
            ]
        }
    }
}

