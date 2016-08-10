module QuestForTheKing.Enemies {
    export function Assassin(): IEnemy {
        return {
            name: 'Assassin',
            hitpoints: 16,
            attack: '1d6',
            reward: 1
        }
    }
}