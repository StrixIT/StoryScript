module QuestForTheKing.Enemies {
    export function Shieldmaiden() {
        return Enemy({
            name: 'Shieldmaiden',
            hitpoints: 18,
            attack: '1d8',
            reward: 1,
            currency: 30
        });
    }
}