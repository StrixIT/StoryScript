module QuestForTheKing.Locations {
    export function ReadParchment(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                },
            ]
        }
    }
}