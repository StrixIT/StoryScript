namespace LanternofWorlds.Locations {
    export function Cave() {
        return Location({
            name: 'Intro',
            destinations: [
                {
                    name: 'Continue',
                    target: Locations.Next,
                }
            ]
        });
    }
}