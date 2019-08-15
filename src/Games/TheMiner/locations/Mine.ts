namespace TheMiner.Locations {
    export function Mine() {
        return Location({
            name: 'Mine',
            destinations: [
                {
                    name: 'Leave the mine',
                    target: Locations.MineEntrance
                }
            ],
        })
    }
}