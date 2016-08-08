module MyNewGame.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Home',
            descriptionSelector: () => {
                var date = new Date();
                var hour = date.getHours();

                if (hour <= 6 || hour >= 18) {
                    return 'night';
                }

                return 'day';
            },
            destinations: [
                {
                    text: 'To the garden',
                    target: Locations.Garden
                },
                {
                    text: 'Out the front door',
                    target: Locations.DirtRoad
                }
            ],
            items: [
                Items.Sword,
                Items.LeatherBoots
            ]
        }
    }
}