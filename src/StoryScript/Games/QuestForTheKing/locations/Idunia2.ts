module QuestForTheKing.Locations {
    export function Idunia2(): StoryScript.ILocation {
        return {
            name: 'Idunia',
            destinations: [
                {
                    text: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
                {

                    text: 'Aifor',
                    target: Locations.Aifor
                },            
                {

                    text: 'Gelandri',
                    target: Locations.Gelandri
                },
                {

                    text: 'Lysa',
                    target: Locations.Lysa
                },     
                {

                    text: 'Sandfell',
                    target: Locations.Sandfell
                },    
                {

                    text: 'Ravendal',
                    target: Locations.Ravendal
                },  
            ]
        }
    }
}