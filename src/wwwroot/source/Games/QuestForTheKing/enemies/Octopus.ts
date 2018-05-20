module QuestForTheKing.Enemies {
    export function Octopus(): IEnemy {
        return {
            name: 'Giant Octopus',
            hitpoints: 20,
            attack: '1d6',
            reward: 3,
            activeDay: true,
            onDefeat: (game: IGame) => {
                game.currentLocation.actions.length = 0;
            }
        }
    }
}