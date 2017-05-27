module MyNewGame.Locations {
    export function Basement(): StoryScript.ILocation {
        return {
            name: 'Basement',
            destinations: [
                {
                    text: 'To the garden',
                    target: Locations.Garden
                }
            ],
            items: [
                Items.Journal
            ]
        }
    }
}