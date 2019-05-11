module QuestForTheKing.Enemies {
    export function Troll() {
        return Enemy({
            name: 'Troll',
            hitpoints: 22,
            attack: '1d8',
            reward: 4
        });
    }
}