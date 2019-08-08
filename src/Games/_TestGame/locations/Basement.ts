namespace _TestGame.Locations {
    export function Basement() {
        return Location({
            name: 'Basement',
            destinations: [
                {
                    name: 'To the garden',
                    target: Locations.Garden
                }
            ],
            items: [
                Items.Journal()
            ]
        });
    }
}