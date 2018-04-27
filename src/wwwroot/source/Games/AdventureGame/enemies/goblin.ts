namespace AdventureGame.Enemies {
    export function Goblin(): IEnemy {
        return {
            name: 'Goblin',
            hitpoints: 6,
            items: [
                Items.Dagger
            ]
        }
    }
}