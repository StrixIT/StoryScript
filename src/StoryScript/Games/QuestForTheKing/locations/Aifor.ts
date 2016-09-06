module QuestForTheKing.Locations {
    export function Aifor(): StoryScript.ILocation {
        return {
            name: 'Aifor',
            destinations: [
                {
                    text: 'Fasold the Storyteller',
                    target: Locations.Fasold1
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
                {

                    text: 'Sandfell',
                    target: Locations.Sandfell
                },
            ]
        }
    }
}
