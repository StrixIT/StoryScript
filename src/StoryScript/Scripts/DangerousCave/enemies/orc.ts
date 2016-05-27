module StoryScript.Enemies {
    export function Orc(): Interfaces.IEnemy {
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