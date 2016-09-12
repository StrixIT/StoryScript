module QuestForTheKing.Locations {
    export function AttackShadow(): StoryScript.ILocation {
        return {
            name: 'Attacking the Shadow',
            destinations: [
                {
                    text: 'Back to the Map',
                    target: Locations.Quest1map2
                }              
            ],
                enemies: [
                    Enemies.Octopus
                    
            ],               
        }
    }
}    
