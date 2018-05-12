module QuestForTheKing.Enemies {
    export function Twoheadedwolf(): IEnemy {
        return {
            name: 'Two-Headed Wolf',
            hitpoints: 20,
            attack: '1d8',
            reward: 4
        }
    }
}