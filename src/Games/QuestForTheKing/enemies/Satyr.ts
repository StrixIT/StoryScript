module QuestForTheKing.Enemies {
    export function Satyr() {
        return BuildEnemy({
            name: 'Satyr',
            hitpoints: 18,
            attack: '1d6',
            reward: 2
        });
    }
}