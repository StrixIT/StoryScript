namespace DangerousCave.Locations {
    export function RoomOne() {
        return Location({
            name: 'De kamer van de ork',
            enemies: [
                Enemies.Orc()
            ],
            items: [
                Items.BlackKey()
            ],
            destinations: [
                {
                    name: 'Noord',
                    target: Locations.RightCorridor,
                    barrier: {
                        name: 'Houten deur',
                        actions: [
                            {
                                text: 'Onderzoek de deur',
                                execute: Actions.Inspect('Een eikenhouten deur met een ijzeren hendel. De deur is niet op slot.')
                            },
                            {
                                text: 'Open de deur',
                                execute: StoryScript.Actions.Open((game: IGame, destination: StoryScript.IDestination) => {
                                    game.logToLocationLog('Je opent de eikenhouten deur.');
                                    destination.name = 'Gang (noord)';
                                })
                            }
                        ]
                    }
                },
                {
                    name: 'Tweede deur (west)',
                    target: Locations.CentreRoom,
                },
                {
                    name: 'Derde deur (zuid)',
                    target: Locations.LeftRoom
                },
                {
                    name: 'Deuropening (oost); richting ingang',
                    target: Locations.LeftCorridor
                }
            ]
        });
    }
}