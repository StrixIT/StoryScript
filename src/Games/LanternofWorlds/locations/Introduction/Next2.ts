namespace LanternofWorlds.Locations {
    export function Next2() {
        return Location({
            name: 'Intro',
            destinations: [
                {
                    name: 'Start your adventure',
                    target: Locations.Next2,
                }
                
            ]
        });
    }
}