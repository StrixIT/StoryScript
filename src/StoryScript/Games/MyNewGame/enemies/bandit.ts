module MyNewGame.Enemies {
    export function Bandit(): IEnemy {
        return {
            name: 'Bandit',
            description: StoryScript.Constants.HTML,
            hitpoints: 10,
            attack: '1d6',
            items: [
                Items.Sword,
                Items.BasementKey
            ]
        }
    }
}