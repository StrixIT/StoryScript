namespace LanternofWorlds.Locations {
    export function Warrior() {
        return Location({
            name: 'Warrior',
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