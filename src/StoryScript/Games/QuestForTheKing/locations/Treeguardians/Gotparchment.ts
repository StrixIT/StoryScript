module QuestForTheKing.Locations {
    export function Gotparchment(): StoryScript.ILocation {
        return {
            name: 'The Strange Trees',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map4
                },
                {
                    text: 'To the Cliffwall',
                    target: Locations.CliffwallDay
                }                               
                    
                ]
        }
    }
}    
