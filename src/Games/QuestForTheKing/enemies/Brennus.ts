module QuestForTheKing.Enemies {
    export function Brennus(): IEnemy {
        return {
            name: 'Brennus',
            hitpoints: 20,
            attack: '1d8',
            reward: 2
        }
    }
}