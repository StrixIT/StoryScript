module QuestForTheKing.Enemies {
    export function Bandit(): IEnemy {
        return {
            name: 'Bandit',
            hitpoints: 14,
            attack: '1d4',
            reward: 1
        }
    }
}