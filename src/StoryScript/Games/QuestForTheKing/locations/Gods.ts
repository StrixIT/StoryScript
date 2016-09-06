module QuestForTheKing.Locations {
    export function Gods(): StoryScript.ILocation {
        return {
            name: 'Gods of Idunia',
            destinations: [
                {
                    text: 'Fasold the Storyteller',
                    target: Locations.Fasold1
                },
                {

                    text: 'The Skysister',
                    target: Locations.Skysister
                },
                {

                    text: 'The Seasister',
                    target: Locations.Seasister
                },
                {

                    text: 'The Moonsister',
                    target: Locations.Moonsister
                },
                {

                    text: 'Lesser Sisters',
                    target: Locations.Lessersisters
                }        
            ]
        }
    }
}
