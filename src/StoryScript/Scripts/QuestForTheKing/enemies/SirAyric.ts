module QuestForTheKing.Enemies {
    export function SirAyric(): IEnemy {
        return {
            name: 'Sir Ayric',
            hitpoints: 20,
            attack: '1d8',
            reward: 1,
            onDefeat: (game: IGame) => {
                game.state = 'victory';
            }
        }
    }
}