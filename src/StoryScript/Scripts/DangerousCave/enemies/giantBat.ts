module DangerousCave.Enemies {
    export function GiantBat(): StoryScript.IEnemy {
        return {
            name: 'Reuzenvleermuis',
            hitpoints: 7,
            attack: '1d6',
            reward: 1
        }
    }
}