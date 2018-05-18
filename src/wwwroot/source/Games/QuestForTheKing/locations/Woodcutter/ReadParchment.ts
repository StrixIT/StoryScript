module QuestForTheKing.Locations {
    export function ReadParchment(): StoryScript.ILocation {
        return {
            name: 'Read the parchment',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map1
                },
            ]
        }
    }
}