namespace MyNewGame.Enemies {
    export function Bandit() {
        return BuildEnemy({
            name: 'Bandit',
            hitpoints: 10,
            attack: '1d6',
            items: [
                Items.Sword,
                Items.BasementKey
            ]
        });
    }
}