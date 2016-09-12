module QuestForTheKing.Locations {
    export function Victory(): StoryScript.ILocation {
        return {
            name: 'Victory',
            destinations: [
                {
                    text: 'Start again',
                    target: Locations.Start
                },
                {
                    text: 'Start your first Quest',
                    target: Locations.Quest1,
                    style: 'location-danger'
                }
            ]           
        }
    }
}
