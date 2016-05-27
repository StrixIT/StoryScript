module StoryScript.Locations {
    export function RightCorridor(): Interfaces.ILocation {
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