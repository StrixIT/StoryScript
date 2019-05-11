module QuestForTheKing.Enemies {
    export function Rockwolf() {
        return BuildEnemy({
            name: 'Rockwolf',
            hitpoints: 18,
            attack: '1d6',
            reward: 2
        });
    }
}