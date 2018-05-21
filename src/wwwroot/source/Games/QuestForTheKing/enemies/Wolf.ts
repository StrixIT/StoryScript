module QuestForTheKing.Enemies {
    export function Twoheadedwolf(): IEnemy {
        return {
            name: 'Two-Headed Wolf',
            hitpoints: 20,
            attack: '1d8',
            reward: 4,
            onAttack: (game: IGame) => {
                if (game.worldProperties.freedFaeries) {
                    game.currentLocation.text += game.currentLocation.descriptions['freedfaeries'];
                    game.currentLocation.enemies.length = 0;
                }
            }
        }
    }
}