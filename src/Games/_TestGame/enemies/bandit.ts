namespace _TestGame.Enemies {
    export function Bandit() {
        return Enemy({
            name: 'Bandit',
            hitpoints: 10,
            attack: '1d6',
            items: [
                Items.Sword(),
                Items.BasementKey()
            ]
        });
    }
}