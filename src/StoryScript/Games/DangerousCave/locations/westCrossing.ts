module DangerousCave.Locations {
    export function WestCrossing(): StoryScript.ILocation {
        return {
            name: 'Een donkere gemetselde gang',
            enemies: [
                Enemies.Goblin
            ],
            destinations: [
                {
                    text: 'Richting kruispunt (oost)',
                    target: Locations.CrossRoads
                },
                {
                    text: 'Deur (west)',
                    target: Locations.Arena,
                    barrier: {
                        text: 'Metalen deur',
                        key: Items.BlackKey,
                        actions: [
                            {
                                text: 'Onderzoek de deur',
                                action: Actions.Inspect('Een deur van een dof grijs metaal, met een rode deurknop. Op de deur staat een grote afbeelding: een rood zwaard. Zodra je het handvat aanraakt, gloeit het zwaard op met een rood licht. De deur is niet op slot.')
                            },
                            {
                                text: 'Open de deur',
                                action: Actions.Open(function (game, destination) {
                                    game.logToLocationLog('Je opent de deur.');
                                    destination.text = 'Donkere kamer';
                                })
                            }
                        ]
                    }
                }
            ]
        }
    }
}