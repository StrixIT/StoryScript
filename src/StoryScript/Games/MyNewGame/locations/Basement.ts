module MyNewGame.Locations {
    export function Basement(): StoryScript.ILocation {
        return {
            name: 'Basement',
            destinations: [
                {
                    name: 'To the garden',
                    target: Locations.Garden
                }
            ],
            items: [
                Items.Journal
            ]
        }
    }
}