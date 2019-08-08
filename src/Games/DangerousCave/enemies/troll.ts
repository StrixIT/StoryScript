namespace DangerousCave.Enemies {
    export function Troll() {
        return Enemy({
            name: 'Trol',
            hitpoints: 20,
            attack: '2d6',
            reward: 2,
            items: [
                Items.HealingPotion()
            ]
        });
    }
}