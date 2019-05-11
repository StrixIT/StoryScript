module QuestForTheKing.Locations {
    export function Gelandri() {
        return Location({
            name: 'Gelandri',
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
