module QuestForTheKing.Locations {
    export function BrennusNight(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    text: 'Approach the Tent',
                    target: Locations.BrennusApproach
                },
                {

                    text: 'Leave',
                    target: Locations.Quest1map1                        
                },
            ]
        }
    }
}
