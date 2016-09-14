module QuestForTheKing.Locations {
    export function Idunia(): StoryScript.ILocation {
        return {
            name: 'The Kingdom of Idunia',
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
                {

                    text: 'Sandfell',
                    target: Locations.Sandfell
                },
            ]
        }
    }
}