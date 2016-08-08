module MyNewGame.Locations {
    export function DirtRoad(): StoryScript.ILocation {
        return {
            name: 'Dirt road',
            destinations: [
                {
                    text: 'Enter your home',
                    target: Locations.Start
                }
            ],
            enemies: [
                Enemies.Bandit
            ]
        }
    }
}