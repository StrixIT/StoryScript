module QuestForTheKing.Locations {
    export function BrennusDay(): StoryScript.ILocation {
        return {
            name: 'Brennus',
            destinations: [
                {
                    text: 'Brennus Defeated',
                    target: Locations.BrennusDayDefeated
                }              
            ],
                enemies: [
                    Enemies.Brennus
                    
                ]
        }
    }
}    
