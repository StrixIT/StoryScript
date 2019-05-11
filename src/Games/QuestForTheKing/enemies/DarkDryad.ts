module QuestForTheKing.Enemies {
    export function DarkDryad() {
        return BuildEnemy({
            name: 'The Dark Dryad',
            hitpoints: 20,
            attack: '1d6',
            reward: 3
        });
    }
}