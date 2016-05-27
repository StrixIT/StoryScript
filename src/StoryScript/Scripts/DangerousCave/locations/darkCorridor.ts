module StoryScript.Locations {
    export function DarkCorridor(): ILocation {
        return {
            name: 'Een donkere smalle gang',
            enemies: [
                Enemies.Orc
            ],
            destinations: [
                {
                    text: 'Richting grote grot (oost)',
                    target: Locations.CandleLitCave
                },
                {
                    text: 'Richting kruispunt (west)',
                    target: Locations.CrossRoads
                }
            ],
        }
    }
}