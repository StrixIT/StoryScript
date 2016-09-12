module QuestForTheKing.Locations {
    export function OctopusDay(): StoryScript.ILocation {
        return {
            name: 'The Giant Octopus',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map1
                }              
            ],
                enemies: [
                    Enemies.Octopus
                    
            ],               
        }
    }
}    
