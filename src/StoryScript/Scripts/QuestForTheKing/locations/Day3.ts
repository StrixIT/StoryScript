module QuestForTheKing.Locations {
    export function Day3(): StoryScript.ILocation {
        return {
            name: 'Day 3',
            destinations: [
                {
                    text: 'Day 4',
                    target: Locations.Day4
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith3
                },
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent3
                },
            ],
            enemies: [
                Enemies.Shieldmaiden
            ]
        }
    }
}