namespace DePrinsesInDeToren.Locations {
    export function Start() {
        return Location({
            name: 'Start',
            destinations: [
                {
                    name: 'Doe alsof je slaapt',
                    target: Locations.Gluur
                },
                {
                    name: 'Zeg: "wie is daar?"',
                    target: Locations.Spreek
                }
            ],
            features: [
            ],
            items: [
            ],
            enemies: [
            ],
            persons: [
            ],
            enterEvents: [
            ],
            leaveEvents: [
            ],
            actions: [
            ],
            combatActions: [
            ],
        });
    }
}