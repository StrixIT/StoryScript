module QuestForTheKing.Enemies {
    export function Ghost(): IEnemy {
        return {
            name: 'Wraith',
            hitpoints: 14,
            attack: '1d4',
            reward: 1,
            nightEncounter: true
        }
    }
}