module QuestForTheKing.Enemies {
    export function Satyr() {
        return Enemy({
            name: 'Satyr',
            hitpoints: 18,
            attack: '1d6',
            reward: 2
        });
    }
}