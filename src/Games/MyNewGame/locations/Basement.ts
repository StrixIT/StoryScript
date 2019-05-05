namespace MyNewGame.Locations {
    export function Basement() {
        return BuildLocation({
            name: 'Basement',
            destinations: [
                {
                    name: 'To the garden',
                    target: Locations.Garden
                }
            ],
            items: [
                Items.Journal
            ]
        });
    }
}