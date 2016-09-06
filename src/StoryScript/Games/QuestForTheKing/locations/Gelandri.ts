module QuestForTheKing.Locations {
    export function Gelandri(): StoryScript.ILocation {
        return {
            name: 'Gelandri',
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
