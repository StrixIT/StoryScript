module DangerousCave.Enemies {
    export function Orc(): StoryScript.IEnemy {
        return {
            name: 'Ork',
            hitpoints: 12,
            attack: '2d4+1',
            reward: 1,
            items: [
                Items.IronHelmet
            ]
        }
    }
}