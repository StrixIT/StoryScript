module QuestForTheKing.Enemies {
    export function Necromancer() {
        return BuildEnemy({
            name: 'The Necromancer',
            hitpoints: 16,
            attack: '1d8',
            reward: 3
        });
    }
}