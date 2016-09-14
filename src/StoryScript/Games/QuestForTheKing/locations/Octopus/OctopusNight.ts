module QuestForTheKing.Locations {
    export function OctopusNight(): StoryScript.ILocation {
        return {
            name: 'The Giant Octopus',
            destinations: [
                {
                    text: 'Attack the Shadow',
                    target: Locations.AttackShadow
                },       
                {
                    text: 'Leave the Shadow alone',
                    target: Locations.LeaveShadow
                }              
            ],                         
        }
    }
}    
