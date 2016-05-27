module StoryScript.Enemies {
    export function GiantBat(): Interfaces.IEnemy {
        return {
            name: 'Reuzenvleermuis',
            hitpoints: 7,
            attack: '1d6',
            reward: 1
        }
    }
}