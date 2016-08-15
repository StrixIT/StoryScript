module QuestForTheKing.Enemies {
    export function SirAyric(): IEnemy {
        return {
            name: 'Sir Ayric',
            hitpoints: 20,
            attack: '1d8',
            reward: 1,
            onDefeat: (game: IGame) => {
                game.currentLocation.actions = game.currentLocation.actions || [];
                game.currentLocation.actions.push(
                    {
                        text: 'To the feast',
                        execute: (game) => {
                            game.state = StoryScript.GameState.Victory
                        }
                    })
            }
        }
    }
}