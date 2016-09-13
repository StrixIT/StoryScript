module QuestForTheKing.Locations {
    export function Day1(): StoryScript.ILocation {
        return {
            name: 'Day 1',
            destinations: [
                {
                    text: 'Day 2',
                    target: Locations.Day2
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith
                },
                {

                    text: 'The Storyteller',
                    target: Locations.Fasold1
                },
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent
                }

            ],
            enemies: [
                Enemies.Farmboy
            ],
            events: [
                changeDay
            ]
        }
    }
}
