module QuestForTheKing.Enemies {
    export function Nobleman() {
        return BuildEnemy({
            name: 'Nobleman',
            hitpoints: 14,
            attack: '1d4',
            reward: 1,
            currency: 15
        });
    }
}