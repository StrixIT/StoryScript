module QuestForTheKing.Locations {
    export function Idunia() {
        return Location({
            name: 'The Kingdom of Idunia',
            destinations: [
                {
                    name: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
                {

                    name: 'Aifor',
                    target: Locations.Aifor
                },
                {

                    name: 'Gelandri',
                    target: Locations.Gelandri
                },
                {

                    name: 'Idunia',
                    target: Locations.Idunia2
                },
                {

                    name: 'Lysa',
                    target: Locations.Lysa
                },
                {

                    name: 'Ravendal',
                    target: Locations.Ravendal
                },
                {

                    name: 'Sandfell',
                    target: Locations.Sandfell
                },
            ]
        });
    }
}