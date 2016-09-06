module QuestForTheKing.Locations {
    export function Sandfell(): StoryScript.ILocation {
        return {
            name: 'Sandfell',
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

                    text: 'Ravendal',
                    target: Locations.Ravendal
                },
            ]            
        }
    }
}