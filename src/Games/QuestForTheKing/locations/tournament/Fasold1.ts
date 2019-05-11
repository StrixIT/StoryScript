module QuestForTheKing.Locations {
    export function Fasold1() {
        return Location({
            name: 'Fasold the Storyteller',
            destinations: [
                {
                    name: 'Day 2',
                    target: Locations.Day2
                },
                {

                    name: 'Weapon Smith',
                    target: Locations.WeaponSmith
                },            
                {

                    name: 'Healers Tent',
                    target: Locations.HealersTent
                },
                {

                    name: 'Ask about the Gods of Idunia',
                    target: Locations.Gods
                },     
                {

                    name: 'Ask about the kingdom of Idunia',
                    target: Locations.Idunia
                },  
            ]
        });
    }
}