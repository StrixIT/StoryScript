module QuestForTheKing.Enemies {
    export function Troll(): IEnemy {
        return {
            name: 'Troll',
            hitpoints: 22,
            attack: '1d8',
            reward: 4
        }
    }
}