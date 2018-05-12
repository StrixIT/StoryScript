module QuestForTheKing.Locations {
    export function OctopusNight(): StoryScript.ILocation {
        return {
            name: 'The Giant Octopus',
            destinations: [
                {
                    name: 'Attack the Shadow',
                    target: Locations.AttackShadow
                },       
                {
                    name: 'Leave the Shadow alone',
                    target: Locations.LeaveShadow
                }              
            ],                         
        }
    }
}    
