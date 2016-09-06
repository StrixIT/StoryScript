module QuestForTheKing.Locations {
    export function Lysa(): StoryScript.ILocation {
        return {
            name: 'Lysa',
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

                    text: 'Idunia',
                    target: Locations.Idunia2
                },       
                {

                    text: 'Ravendal',
                    target: Locations.Ravendal
                },  
                {

                    text: 'Sandfell',
                    target: Locations.Sandfell
                },  
            ]
        }
    }
}