module QuestForTheKing.Locations {
    export function CliffwallDay(): StoryScript.ILocation {
        return {
            name: 'The Cliffwall',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map4
                },    
                {
                    name: 'The Dark Cave',
                    target: Locations.Darkcave
                }                                     
            ],
            enemies: [
                Enemies.Twoheadedwolf

            ]
        }
    }
}    
