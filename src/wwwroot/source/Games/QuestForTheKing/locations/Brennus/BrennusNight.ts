module QuestForTheKing.Locations {
    export function BrennusNight(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    name: 'Approach the Tent',
                    target: Locations.BrennusApproach
                },
                {

                    name: 'Leave',
                    target: Locations.Quest1map1                        
                },
            ]
        }
    }
}
