module MyNewGame.Enemies {
    export function Bandit(): StoryScript.IEnemy {
        return {
            name: 'Bandit',
            pictureFileName: 'bandit.jpg',
            hitpoints: 10,
            attack: '1d6',
            reward: 1,
            items: [
                Items.Sword
            ]
        }
    }
}