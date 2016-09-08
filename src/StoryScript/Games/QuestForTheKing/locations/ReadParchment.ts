module QuestForTheKing.Locations {
    export function ReadParchment(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                },
            ]
        }
    }
}