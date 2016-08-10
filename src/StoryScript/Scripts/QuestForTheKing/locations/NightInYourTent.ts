module QuestForTheKing.Locations {
    export function NightInYourTent(): StoryScript.ILocation {
        return {
            name: 'Night in your tent',
            destinations: [
                {
                    text: 'Day 3',
                    target: Locations.Day3
                }
            ],
            enemies: [
                Enemies.Assassins
            ]
        }
    }
}    
