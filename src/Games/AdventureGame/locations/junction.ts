namespace AdventureGame.Locations {
    export function Junction(): StoryScript.ILocation {
        return {
            name: 'Junction',
            enemies: [
                Enemies.Goblin
            ]
        }
    }
}