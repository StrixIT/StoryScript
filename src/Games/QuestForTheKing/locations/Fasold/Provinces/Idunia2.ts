module QuestForTheKing.Locations {
    export function Idunia2(): StoryScript.ILocation {
        return {
            name: 'Idunia',
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

                    name: 'Lysa',
                    target: Locations.Lysa
                },     
                {

                    name: 'Sandfell',
                    target: Locations.Sandfell
                },    
                {

                    name: 'Ravendal',
                    target: Locations.Ravendal
                },  
            ]
        }
    }
}