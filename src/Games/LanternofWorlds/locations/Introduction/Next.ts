namespace LanternofWorlds.Locations {
    export function Next() {
        return Location({
            name: 'Intro',
            destinations: [
                {
                    name: 'Continue',
                    target: Locations.Next2,
                }
                
            ]
        });
    }
}