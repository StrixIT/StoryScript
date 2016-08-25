module QuestForTheKing.Locations {
    export function Day2(): StoryScript.ILocation {
        return {
            name: 'Day 2',
            enemies: [
                Enemies.Nobleman
            ],
            destinations: [
                {
                    text: 'Night in your Tent',
                    target: Locations.NightInYourTent
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith2
                },
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent2
                }

            ],
            events: [
                (game: IGame) => {
                    game.currentDay = 2;
                }
            ]
        }
    }
}