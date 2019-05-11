module QuestForTheKing.Locations {
    export function Lysa() {
        return Location({
            name: 'Lysa',
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