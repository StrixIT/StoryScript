module QuestForTheKing.Enemies {
    export function Mirrorimage(): IEnemy {
        return {
            name: 'Mirror Image',
            hitpoints: 15,
            attack: '1d6',
            reward: 1
        }
    }
}