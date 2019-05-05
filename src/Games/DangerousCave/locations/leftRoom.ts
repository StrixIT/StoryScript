namespace DangerousCave.Locations {
    export function LeftRoom() {
        return BuildLocation({
            name: 'De slaapkamer van de orks',
            enemies: [
                Enemies.Orc,
                Enemies.Goblin
            ],
            destinations: [
                {
                    name: 'De kamer van de ork',
                    target: Locations.RoomOne
                }
            ]
        });
    }
}