module DangerousCave.Enemies {
    export function Troll(): StoryScript.IEnemy {
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