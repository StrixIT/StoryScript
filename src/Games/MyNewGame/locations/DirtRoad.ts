namespace MyNewGame.Locations {
    export function DirtRoad() {
        return Location({
            name: 'Dirt road',
            destinations: [
                {
                    name: 'Enter your home',
                    target: Locations.Start
                }
            ],
            enemies: [
                Enemies.Bandit()
            ],
            combatActions: [
                {
                    text: 'Run back inside',
                    execute: (game: IGame) => {
                        game.changeLocation('Start');
                        game.logToActionLog(`You storm back into your house and slam the 
                                            door behind you. You where lucky... this time!`);
                        return true;
                    }
                }
            ]
        });
    }
}