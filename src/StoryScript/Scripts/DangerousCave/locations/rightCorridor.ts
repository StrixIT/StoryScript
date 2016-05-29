module DangerousCave.Locations {
    export function RightCorridor(): StoryScript.ILocation {
        return {
            name: 'Een gemetselde gang',
            destinations: [
                {
                    text: 'Naar het kruispunt (noord)',
                    target: Locations.CrossRoads
                },
                {
                    text: 'Door de houten deur (zuid)',
                    target: Locations.RoomOne
                }
            ]
        }
    }
}