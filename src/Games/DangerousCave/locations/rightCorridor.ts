namespace DangerousCave.Locations {
    export function RightCorridor() {
        return Location({
            name: 'Een gemetselde gang',
            destinations: [
                {
                    name: 'Naar het kruispunt (noord)',
                    target: Locations.CrossRoads
                },
                {
                    name: 'Door de houten deur (zuid)',
                    target: Locations.RoomOne
                }
            ]
        });
    }
}