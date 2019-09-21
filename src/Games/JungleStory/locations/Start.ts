namespace JungleStory.Locations {
    export function Start() {
        return Location({
            name: 'Start',
            destinations: [
                {
                    name: 'Onderzoek je omgeving',
                    target: Locations.Omgeving
                },
                {
                    name: 'Onderzoek jezelf',
                    target: Locations.Zelf
                },
                {
                    name: 'Ga slapen',
                    target: Locations.Slaap
                },
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