module QuestForTheKing.Locations {
    export function Day3() {
        return Location({
            name: 'Day 3',
            destinations: [
                {
                    name: 'Day 4',
                    target: Locations.Day4
                },
                {

                    name: 'Weapon Smith',
                    target: Locations.WeaponSmith
                },
                {

                    name: 'Healers Tent',
                    target: Locations.HealersTent
                },
            ],
            enemies: [
                Enemies.Shieldmaiden()
            ],
            enterEvents: [
                changeDay
            ]
        });
    }
}