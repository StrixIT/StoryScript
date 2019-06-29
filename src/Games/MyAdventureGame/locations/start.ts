namespace MyAdventureGame.Locations {
    export function Start() {
        return Location({
            name: 'Start',
            features: [
                Features.Fountain()
            ]
        });
    }
}