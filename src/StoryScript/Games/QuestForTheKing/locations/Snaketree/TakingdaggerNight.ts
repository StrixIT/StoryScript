module QuestForTheKing.Locations {
    export function TakingdaggerNight(): StoryScript.ILocation {
        return {
            name: 'The Snake Tree',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map3
                }
            ],
            items: [
                Items.Poisondagger
            ]
        }
    }
}