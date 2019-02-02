module QuestForTheKing.Enemies {
    export function Nobleman(): IEnemy {
        return {
            name: 'Nobleman',
            hitpoints: 14,
            attack: '1d4',
            reward: 1,
            currency: 15
        }
    }
}