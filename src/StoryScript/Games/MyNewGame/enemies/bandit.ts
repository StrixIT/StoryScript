module MyNewGame.Enemies {
    export function Bandit(): IEnemy {
        return {
            name: 'Bandit',
            pictureFileName: 'bandit.jpg',
            hitpoints: 10,
            attack: '1d6',
            items: [
                Items.Sword,
                Items.BasementKey
            ]
        }
    }
}