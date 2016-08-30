module QuestForTheKing.Enemies {
    export function Nobleman(): IEnemy {
        return {
            name: 'Nobleman',
            hitpoints: 15,
            attack: '1d6',
            reward: 1,
            currency: 15
        }
    }
}