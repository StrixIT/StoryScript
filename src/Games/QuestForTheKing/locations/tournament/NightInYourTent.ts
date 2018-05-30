module QuestForTheKing.Locations {
    export function NightInYourTent(): StoryScript.ILocation {
        return {
            name: 'Night in your tent',
            destinations: [
                {
                    name: 'Day 3',
                    target: Locations.Day3
                }
            ],
            enemies: [
                StoryScript.custom(Enemies.Assassin, { name: 'Female Assassin' }),
                StoryScript.custom(Enemies.Assassin, { name: 'Male Assassin' })
            ]
        }
    }
}    
