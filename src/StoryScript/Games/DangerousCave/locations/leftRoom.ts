module DangerousCave.Locations {
    export function LeftRoom(): StoryScript.ILocation {
        return {
            name: 'De slaapkamer van de orks',
            enemies: [
                Enemies.Orc,
                Enemies.Goblin
            ],
            destinations: [
                {
                    text: 'De kamer van de ork',
                    target: Locations.RoomOne
                }
            ]
        }
    }
}