module DangerousCave.Enemies {
    export function GiantBat(): IEnemy {
        return {
            name: 'Reuzenvleermuis',
            hitpoints: 7,
            attack: '1d6',
            reward: 1
        }
    }
}