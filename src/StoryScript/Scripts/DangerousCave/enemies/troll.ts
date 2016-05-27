module StoryScript.Enemies {
    export function Troll(): Interfaces.IEnemy {
        return {
            name: 'Trol',
            hitpoints: 20,
            attack: '2d6',
            reward: 2,
            items: [
                Items.HealingPotion
            ]
        }
    }
}