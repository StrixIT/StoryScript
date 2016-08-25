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
                    target: Locations.WeaponSmith
                },
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent
                }

            ],
            events: [
                changeDay
            ]
        }
    }
}