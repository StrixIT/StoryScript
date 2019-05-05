namespace DangerousCave.Enemies {
    export function Troll() {
        return BuildEnemy({
            name: 'Trol',
            hitpoints: 20,
            attack: '2d6',
            reward: 2,
            items: [
                Items.HealingPotion
            ]
        });
    }
}