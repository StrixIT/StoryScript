module QuestForTheKing.Enemies {
    export function DarkDryad() {
        return Enemy({
            name: 'The Dark Dryad',
            hitpoints: 20,
            attack: '1d6',
            reward: 3
        });
    }
}