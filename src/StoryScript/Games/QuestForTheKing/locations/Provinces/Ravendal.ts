module QuestForTheKing.Locations {
    export function Ravendal(): StoryScript.ILocation {
        return {
            name: 'Ravendal',
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

                    text: 'Lysa',
                    target: Locations.Lysa
                },        
                {

                    text: 'Sandfell',
                    target: Locations.Sandfell
                },  
            ]
        }
    }
}