module QuestForTheKing.Locations {
    export function Day2(): StoryScript.ILocation {
        return {
            name: 'Day 2',
            enemies: [
                Enemies.Nobleman
            ],
            destinations: [
                {
                    name: 'Night in your Tent',
                    target: Locations.NightInYourTent
                },
                {

                    name: 'Weapon Smith',
                    target: Locations.WeaponSmith
                },
                {

                    name: 'Healers Tent',
                    target: Locations.HealersTent
                }

            ],
            events: [
                changeDay
            ]
        }
    }
}