namespace MyAdventureGame.Locations {
    export function Passage() {
        return Location({
            name: 'A passage in the undergrowth',
            destinations: [
                {
                    name: 'Back to the fountain',
                    target: Locations.Start
                }
            ],
            items: [
                Items.Herbs()
            ],
            features: [
                Features.WoundedWarrior()
            ]
        });
    }
}