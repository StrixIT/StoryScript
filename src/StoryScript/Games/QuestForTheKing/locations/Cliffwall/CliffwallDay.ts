module QuestForTheKing.Locations {
    export function CliffwallDay(): StoryScript.ILocation {
        return {
            name: 'The Cliffwall',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map4
                },    
                {
                    text: 'The Dark Cave',
                    target: Locations.Darkcave
                }                                     
            ],
            enemies: [
                Enemies.Twoheadedwolf

            ]
        }
    }
}    
