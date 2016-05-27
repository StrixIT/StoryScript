module StoryScript.Locations {
    export function RoomOne(): ILocation {
        return {
            name: 'De kamer van de ork',
            enemies: [
                Enemies.Orc
            ],
            items: [
                Items.BlackKey
            ],
            destinations: [
                {
                    text: 'Noord',
                    target: Locations.RightCorridor,
                    barrier: {
                        text: 'Houten deur',
                        actions: [
                            {
                                text: 'Open de deur',
                                action: Actions.Inspect('Een eikenhouten deur met een ijzeren hendel. De deur is niet op slot.')
                            },
                            {
                                text: 'Open de deur',
                                action: Actions.Open((game: DangerousCave.Game, destination: IDestination) => {
                                    game.logToLocationLog('Je opent de eikenhouten deur.');
                                    destination.text = 'Gang (noord)';
                                })
                            }
                        ]
                    }
                },
                {
                    text: 'Tweede deur (west)',
                    target: Locations.CentreRoom,
                },
                {
                    text: 'Derde deur (zuid)',
                    target: Locations.LeftRoom
                },
                {
                    text: 'Deuropening (oost); richting ingang',
                    target: Locations.LeftCorridor
                }
            ]
        }
    }
}