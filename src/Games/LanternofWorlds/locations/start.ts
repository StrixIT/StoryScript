namespace LanternofWorlds.Locations {
    export function Start() {
        return Location({
            name: 'Your adventure begins',
            enterEvents: [
                (game) => { game.changeLocation(Locations.Cave) }
            ],
            destinations: [
                
            ]
        });
    }
}