module QuestForTheKing.Enemies {
    export function Enchantress() {
        return Enemy({
            name: 'The Enchantress',
            hitpoints: 20,
            attack: '1d8',
            reward: 5
        });
    }
}