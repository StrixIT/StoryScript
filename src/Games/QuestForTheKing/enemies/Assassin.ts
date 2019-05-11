module QuestForTheKing.Enemies {
    export function Assassin() {
        return BuildEnemy({
            name: 'Assassin',
            hitpoints: 12,
            attack: '1d4',
            reward: 1,                  
        });
    }
}