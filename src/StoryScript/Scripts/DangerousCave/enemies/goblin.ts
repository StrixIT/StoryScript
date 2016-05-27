module StoryScript.Enemies {
    export function Goblin(): IEnemy {
        return {
            name: 'Goblin',
            hitpoints: 6,
            attack: 'd4+3',
            reward: 1,
            items: [
                Items.Dagger
            ]
        }
    }
}