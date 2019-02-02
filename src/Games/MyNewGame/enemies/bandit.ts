namespace MyNewGame.Enemies {
    export function Bandit(): IEnemy {
        return {
            name: 'Bandit',
            hitpoints: 10,
            attack: '1d6',
            items: [
                Items.Sword,
                Items.BasementKey
            ]
        }
    }
}