module QuestForTheKing.Enemies {
    export function Bandit() {
        return Enemy({
            name: 'Bandit',
            hitpoints: 14,
            attack: '1d4',
            reward: 1,
            activeDay: true
        });
    }
}