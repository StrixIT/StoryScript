namespace DangerousCave.Locations {
    export function DarkCorridor() {
        return Location({
            name: 'Een donkere smalle gang',
            enemies: [
                Enemies.Orc()
            ],
            destinations: [
                {
                    name: 'Richting grote grot (oost)',
                    target: Locations.CandleLitCave
                },
                {
                    name: 'Richting kruispunt (west)',
                    target: Locations.CrossRoads
                }
            ],
        });
    }
}