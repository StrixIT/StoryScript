module QuestForTheKing.Locations {
    export function BrennusDayDefeated(): StoryScript.ILocation {
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