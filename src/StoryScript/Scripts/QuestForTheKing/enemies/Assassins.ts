module QuestForTheKing.Enemies {
    export function Assassins(): IEnemy {
        return {
            name: 'Assassins',
            hitpoints: 16,
            attack: '1d6',
            reward: 1
        }
    }
}