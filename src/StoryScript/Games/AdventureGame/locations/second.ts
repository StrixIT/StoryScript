module AdventureGame.Locations {
    export function Second(): StoryScript.ILocation {
        return {
            name: 'Second',
            destinations: [
                {
                    target: Locations.Start,
                    name: 'Second'
                }
            ]
        }
    }
}