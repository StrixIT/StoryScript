module QuestForTheKing.Enemies {
    export function SirAyric() {
        return BuildEnemy({
            name: 'Sir Ayric',
            hitpoints: 20,
            attack: '1d8',
            reward: 1
        });
    }
}