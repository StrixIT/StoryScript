namespace DangerousCave.Locations {
    export function WestCrossing() {
        return Location({
            name: 'Een donkere gemetselde gang',
            enemies: [
                Enemies.Goblin()
            ],
            destinations: [
                {
                    name: 'Richting kruispunt (oost)',
                    target: Locations.CrossRoads
                },
                {
                    name: 'Deur (west)',
                    target: Locations.Arena,
                    barrier: {
                        name: 'Metalen deur',
                        key: Items.BlackKey,
                        actions: [
                            {
                                text: 'Onderzoek de deur',
                                execute: Actions.Inspect('Een deur van een dof grijs metaal, met een rode deurknop. Op de deur staat een grote afbeelding: een rood zwaard. Zodra je het handvat aanraakt, gloeit het zwaard op met een rood licht. De deur is niet op slot.')
                            },
                            {
                                text: 'Open de deur',
                                execute: StoryScript.Actions.Open(function (game, destination) {
                                    game.logToLocationLog('Je opent de deur.');
                                    destination.name = 'Donkere kamer';
                                })
                            }
                        ]
                    }
                }
            ]
        });
    }
}