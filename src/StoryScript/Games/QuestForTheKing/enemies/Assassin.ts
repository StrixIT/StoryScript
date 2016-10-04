module QuestForTheKing.Enemies {
    export function Assassin(): IEnemy {
        return {
            name: 'Assassin',
            hitpoints: 12,
            attack: '1d4',
            reward: 1,       
        }
    }
}