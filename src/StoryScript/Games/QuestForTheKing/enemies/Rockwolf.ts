module QuestForTheKing.Enemies {
    export function Rockwolf(): IEnemy {
        return {
            name: 'Rockwolf',
            hitpoints: 18,
            attack: '1d6',
            reward: 2
        }
    }
}