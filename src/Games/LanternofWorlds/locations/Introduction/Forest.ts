namespace LanternofWorlds.Locations {
    export function Forest() {
        return Location({
            name: 'Forest',
            destinations: [
                
            ],
            features: druidMap(),
            items: [
            ],
            enemies: [
                Enemies.Tiger()
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