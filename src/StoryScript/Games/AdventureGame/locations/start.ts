module AdventureGame.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Start',
            enemies: [
                Enemies.Goblin
            ]
        }
    }
}