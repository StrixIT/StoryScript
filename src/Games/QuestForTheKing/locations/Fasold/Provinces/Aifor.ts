module QuestForTheKing.Locations {
    export function Aifor() {
        return Location({
            name: 'Aifor',
            destinations: [
                {
                    name: 'Fasold the Storyteller',
                    target: Locations.Fasold1
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
